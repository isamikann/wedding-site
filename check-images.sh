#!/bin/bash
#
# check-images.sh - img/ 配下の画像サイズをチェックし、最適化状況をレポートする
#
# Usage:
#   ./check-images.sh [--warn WARN_KB] [--error ERROR_KB]
#
# Options:
#   --warn  WARN_KB   ⚠️ の閾値（KB）。デフォルト: 300
#   --error ERROR_KB  ❌ の閾値（KB）。デフォルト: 500
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
IMG_DIR="$SCRIPT_DIR/img"

# デフォルト閾値（KB）
WARN_KB=300
ERROR_KB=500

# 引数パース
while [[ $# -gt 0 ]]; do
    case "$1" in
        --warn)
            WARN_KB="$2"
            shift 2
            ;;
        --error)
            ERROR_KB="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 [--warn WARN_KB] [--error ERROR_KB]"
            echo ""
            echo "  --warn   ⚠️  threshold in KB (default: 300)"
            echo "  --error  ❌ threshold in KB (default: 500)"
            exit 0
            ;;
        *)
            echo "Unknown option: $1" >&2
            exit 1
            ;;
    esac
done

WARN_BYTES=$((WARN_KB * 1024))
ERROR_BYTES=$((ERROR_KB * 1024))

# カウンター
count_ok=0
count_warn=0
count_error=0
size_ok=0
size_warn=0
size_error=0
total_files=0
total_size=0

# ヘッダー
echo "=============================================="
echo "  画像サイズチェックレポート"
echo "  閾値: ✅ < ${WARN_KB}KB | ⚠️  ${WARN_KB}-${ERROR_KB}KB | ❌ >= ${ERROR_KB}KB"
echo "=============================================="
echo ""

# img/ が存在するか確認
if [[ ! -d "$IMG_DIR" ]]; then
    echo "Error: $IMG_DIR が見つかりません" >&2
    exit 1
fi

# backup ディレクトリを除外して画像ファイルを走査
while IFS= read -r -d '' file; do
    # backup ディレクトリ内のファイルをスキップ
    if [[ "$file" == *backup* ]]; then
        continue
    fi

    # ファイルサイズ取得
    if [[ "$(uname -s)" == "Darwin" ]]; then
        file_size=$(stat -f%z "$file")
    else
        file_size=$(stat -c%s "$file")
    fi

    rel_path="${file#"$SCRIPT_DIR"/}"
    size_kb=$(( (file_size + 1023) / 1024 ))

    # 判定
    if [[ $file_size -ge $ERROR_BYTES ]]; then
        marker="❌"
        count_error=$((count_error + 1))
        size_error=$((size_error + file_size))
    elif [[ $file_size -ge $WARN_BYTES ]]; then
        marker="⚠️ "
        count_warn=$((count_warn + 1))
        size_warn=$((size_warn + file_size))
    else
        marker="✅"
        count_ok=$((count_ok + 1))
        size_ok=$((size_ok + file_size))
    fi

    total_files=$((total_files + 1))
    total_size=$((total_size + file_size))

    printf "  %s  %6dKB  %s\n" "$marker" "$size_kb" "$rel_path"

done < <(find "$IMG_DIR" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) -print0 | sort -z)

# サマリー
echo ""
echo "=============================================="
echo "  サマリー"
echo "=============================================="

format_size() {
    local bytes=$1
    if [[ $bytes -ge $((1024 * 1024)) ]]; then
        echo "$(awk "BEGIN {printf \"%.1f\", $bytes / 1048576}")MB"
    else
        echo "$(( (bytes + 1023) / 1024 ))KB"
    fi
}

printf "  ✅ OK (< %dKB):        %3d 枚  %s\n" "$WARN_KB" "$count_ok" "$(format_size $size_ok)"
printf "  ⚠️  WARN (%d-%dKB):    %3d 枚  %s\n" "$WARN_KB" "$ERROR_KB" "$count_warn" "$(format_size $size_warn)"
printf "  ❌ LARGE (>= %dKB):    %3d 枚  %s\n" "$ERROR_KB" "$count_error" "$(format_size $size_error)"
echo "  ---------------------------------------"
printf "  合計:                   %3d 枚  %s\n" "$total_files" "$(format_size $total_size)"
echo ""

if [[ $count_error -gt 0 ]]; then
    echo "  ⚡ ${count_error} 枚の画像が ${ERROR_KB}KB を超えています。最適化を検討してください。"
    echo ""
    exit 1
elif [[ $count_warn -gt 0 ]]; then
    echo "  💡 ${count_warn} 枚の画像が ${WARN_KB}KB を超えています。"
    echo ""
    exit 0
else
    echo "  🎉 すべての画像が最適化されています！"
    echo ""
    exit 0
fi
