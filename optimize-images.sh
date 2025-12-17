#!/bin/bash

# 画像最適化スクリプト
# 使い方: ./optimize-images.sh [ディレクトリパス]

set -e

# 色付きメッセージ
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  画像最適化スクリプト${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# ディレクトリの指定（引数がなければデフォルト）
TARGET_DIR="${1:-img/photos}"

if [ ! -d "$TARGET_DIR" ]; then
    echo -e "${RED}エラー: ディレクトリが見つかりません: $TARGET_DIR${NC}"
    exit 1
fi

# ImageMagickのチェック
if ! command -v convert &> /dev/null; then
    echo -e "${YELLOW}警告: ImageMagickがインストールされていません${NC}"
    echo "インストール方法:"
    echo "  Ubuntu/Debian: sudo apt install imagemagick"
    echo "  Mac: brew install imagemagick"
    echo ""
    echo "ImageMagickなしで続行します（統計のみ表示）"
    IMAGEMAGICK_AVAILABLE=false
else
    IMAGEMAGICK_AVAILABLE=true
    echo -e "${GREEN}✓ ImageMagickが利用可能です${NC}"
    echo ""
fi

# 最適化設定
MAX_WIDTH=1500
MAX_HEIGHT=1500
QUALITY=85

echo "設定:"
echo "  対象ディレクトリ: $TARGET_DIR"
echo "  最大幅: ${MAX_WIDTH}px"
echo "  最大高さ: ${MAX_HEIGHT}px"
echo "  JPEG品質: ${QUALITY}%"
echo ""

# バックアップディレクトリの作成
BACKUP_DIR="${TARGET_DIR}_backup_$(date +%Y%m%d_%H%M%S)"

# 統計情報
TOTAL_FILES=0
TOTAL_BEFORE=0
TOTAL_AFTER=0

# 画像を検索して処理
echo -e "${YELLOW}画像を検索中...${NC}"
echo ""

find "$TARGET_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | while read -r file; do
    TOTAL_FILES=$((TOTAL_FILES + 1))
    
    # ファイルサイズを取得（バイト）
    SIZE_BEFORE=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
    SIZE_MB=$(echo "scale=2; $SIZE_BEFORE / 1048576" | bc)
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "ファイル: $(basename "$file")"
    echo "パス: $file"
    echo "現在のサイズ: ${SIZE_MB}MB"
    
    if [ "$SIZE_BEFORE" -gt 524288 ]; then  # 512KB以上の場合
        echo -e "${YELLOW}⚠ 最適化が推奨されます${NC}"
        
        if [ "$IMAGEMAGICK_AVAILABLE" = true ]; then
            # バックアップを作成（初回のみ）
            if [ ! -d "$BACKUP_DIR" ]; then
                echo -e "${GREEN}バックアップディレクトリを作成: $BACKUP_DIR${NC}"
                mkdir -p "$BACKUP_DIR"
            fi
            
            # ファイルのディレクトリ構造を維持してバックアップ
            RELATIVE_PATH="${file#$TARGET_DIR/}"
            BACKUP_FILE="$BACKUP_DIR/$RELATIVE_PATH"
            BACKUP_FILE_DIR=$(dirname "$BACKUP_FILE")
            mkdir -p "$BACKUP_FILE_DIR"
            cp "$file" "$BACKUP_FILE"
            
            # 画像を最適化
            echo "最適化中..."
            convert "$file" \
                -resize "${MAX_WIDTH}x${MAX_HEIGHT}>" \
                -quality $QUALITY \
                -strip \
                "$file"
            
            SIZE_AFTER=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
            SIZE_AFTER_MB=$(echo "scale=2; $SIZE_AFTER / 1048576" | bc)
            SAVED=$(echo "scale=2; ($SIZE_BEFORE - $SIZE_AFTER) / 1048576" | bc)
            PERCENT=$(echo "scale=1; ($SIZE_BEFORE - $SIZE_AFTER) * 100 / $SIZE_BEFORE" | bc)
            
            echo -e "${GREEN}✓ 最適化完了${NC}"
            echo "新しいサイズ: ${SIZE_AFTER_MB}MB"
            echo "削減量: ${SAVED}MB (${PERCENT}%)"
            
            TOTAL_BEFORE=$((TOTAL_BEFORE + SIZE_BEFORE))
            TOTAL_AFTER=$((TOTAL_AFTER + SIZE_AFTER))
        else
            echo "（ImageMagickが必要です）"
        fi
    else
        echo -e "${GREEN}✓ すでに最適化されています${NC}"
    fi
    echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}処理完了！${NC}"
echo ""

if [ "$IMAGEMAGICK_AVAILABLE" = true ] && [ -d "$BACKUP_DIR" ]; then
    echo "バックアップ: $BACKUP_DIR"
    echo ""
    echo "統計:"
    TOTAL_BEFORE_MB=$(echo "scale=2; $TOTAL_BEFORE / 1048576" | bc)
    TOTAL_AFTER_MB=$(echo "scale=2; $TOTAL_AFTER / 1048576" | bc)
    TOTAL_SAVED_MB=$(echo "scale=2; ($TOTAL_BEFORE - $TOTAL_AFTER) / 1048576" | bc)
    
    echo "  最適化前の合計: ${TOTAL_BEFORE_MB}MB"
    echo "  最適化後の合計: ${TOTAL_AFTER_MB}MB"
    echo "  削減量: ${TOTAL_SAVED_MB}MB"
fi

echo ""
echo -e "${GREEN}ヒント:${NC}"
echo "  - ブラウザでキャッシュをクリアしてから確認してください"
echo "  - 画像の品質に問題がある場合は、バックアップから復元できます"
echo "  - さらに最適化したい場合は、WebP形式への変換を検討してください"
echo ""
