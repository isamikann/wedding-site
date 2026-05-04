#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 引数が指定されていない場合はデフォルトのディレクトリを順番に処理
if [ $# -eq 0 ]; then
    uv run --with Pillow==10.1.0 --with pillow-heif==0.7.1 python3 "$SCRIPT_DIR/optimize-images.py" img/photos
    uv run --with Pillow==10.1.0 --with pillow-heif==0.7.1 python3 "$SCRIPT_DIR/optimize-images.py" img/favorites
else
    exec uv run --with Pillow==10.1.0 --with pillow-heif==0.7.1 python3 "$SCRIPT_DIR/optimize-images.py" "$@"
fi
