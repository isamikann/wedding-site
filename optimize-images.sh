#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
exec uv run --with Pillow==10.1.0 --with pillow-heif==0.7.1 python3 "$SCRIPT_DIR/optimize-images.py" "$@"
