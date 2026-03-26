#!/usr/bin/env python3

from __future__ import annotations

import json
import os
import re
import shutil
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path

from PIL import Image, ImageOps, ImageSequence

try:
    from pillow_heif import register_heif_opener

    register_heif_opener()
except Exception:
    register_heif_opener = None


SUPPORTED_INPUT_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif",
    ".heic",
    ".heif",
}

QUALITY = 85
MAX_WIDTH = 1500
MAX_HEIGHT = 1500
ROOT_CATEGORY_KEY = "__root__"


def natural_key(value: str):
    parts = re.split(r"(\d+)", value.lower())
    key = []
    for part in parts:
        if part.isdigit():
            key.append((0, int(part)))
        else:
            key.append((1, part))
    return key


def bytes_to_mb(size: int) -> str:
    return f"{size / 1048576:.2f}"


def bytes_to_percent(before: int, after: int) -> str:
    if before <= 0:
        return "0.0"
    return f"{((before - after) * 100 / before):.1f}"


def build_display_name(filename: str) -> str:
    stem = Path(filename).stem
    stem = re.sub(r"[_-]+", " ", stem)
    stem = re.sub(r"\s+", " ", stem).strip()
    return stem or filename


def print_header(target_dir: Path) -> None:
    print("========================================")
    print("  画像最適化スクリプト")
    print("========================================")
    print()
    print("設定:")
    print(f"  対象ディレクトリ: {target_dir}")
    print(f"  最大幅: {MAX_WIDTH}px")
    print(f"  最大高さ: {MAX_HEIGHT}px")
    print(f"  JPEG品質: {QUALITY}%")
    print()


def resolve_target_dir(argv: list[str]) -> Path:
    target = Path(argv[1] if len(argv) > 1 else "img/photos")
    if not target.exists() or not target.is_dir():
        raise SystemExit(f"エラー: ディレクトリが見つかりません: {target}")
    return target


def ensure_backup_dir(target_dir: Path) -> Path:
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return target_dir.parent / f"{target_dir.name}_backup_{stamp}"


def relative_category(path: Path, target_dir: Path) -> str:
    relative_parent = path.parent.relative_to(target_dir)
    if str(relative_parent) == ".":
        return ROOT_CATEGORY_KEY
    return relative_parent.as_posix()


def list_input_images(target_dir: Path) -> list[Path]:
    files = [
        path
        for path in target_dir.rglob("*")
        if path.is_file() and path.suffix.lower() in SUPPORTED_INPUT_EXTENSIONS
    ]
    files.sort(key=lambda item: natural_key(item.relative_to(target_dir).as_posix()))
    return files


def backup_source(source_path: Path, backup_dir: Path, target_dir: Path) -> None:
    backup_path = backup_dir / source_path.relative_to(target_dir)
    backup_path.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source_path, backup_path)


def save_image(image: Image.Image, output_path: Path, extension: str) -> None:
    extension = extension.lower()
    output_path.parent.mkdir(parents=True, exist_ok=True)

    if extension in {".jpg", ".jpeg"}:
        exif = image.getexif()
        rgb_image = image.convert("RGB") if image.mode not in ("RGB", "L") else image
        save_kwargs = {
            "format": "JPEG",
            "quality": QUALITY,
            "optimize": True,
            "progressive": True,
        }
        if exif:
            save_kwargs["exif"] = exif.tobytes()
        rgb_image.save(output_path, **save_kwargs)
        return

    if extension == ".png":
        image.save(output_path, format="PNG", optimize=True, compress_level=9)
        return

    if extension == ".webp":
        image.save(output_path, format="WEBP", quality=QUALITY, method=6)
        return

    if extension == ".gif":
        if getattr(image, "is_animated", False):
            frames = []
            durations = []
            for frame in ImageSequence.Iterator(image):
                frames.append(frame.copy().convert("P", palette=Image.Palette.ADAPTIVE))
                durations.append(frame.info.get("duration", image.info.get("duration", 40)))

            first = frames[0]
            first.save(
                output_path,
                format="GIF",
                save_all=True,
                append_images=frames[1:],
                optimize=True,
                loop=image.info.get("loop", 0),
                duration=durations,
                disposal=2,
            )
        else:
            image.save(output_path, format="GIF", optimize=True)
        return

    raise ValueError(f"Unsupported output format: {extension}")


def convert_heic_to_jpeg(source_path: Path, image: Image.Image, backup_dir: Path | None, target_dir: Path) -> Path:
    output_path = source_path.with_suffix(".jpg")
    temp_path = source_path.with_suffix(".jpg.tmp")

    if backup_dir is not None:
        backup_source(source_path, backup_dir, target_dir)

    rgb_image = image.convert("RGB") if image.mode not in ("RGB", "L") else image
    rgb_image.thumbnail((MAX_WIDTH, MAX_HEIGHT), Image.Resampling.LANCZOS)
    rgb_image.save(
        temp_path,
        format="JPEG",
        quality=QUALITY,
        optimize=True,
        progressive=True,
    )
    os.replace(temp_path, output_path)
    source_path.unlink(missing_ok=True)
    return output_path


def optimize_image(source_path: Path, backup_dir: Path | None, target_dir: Path) -> Path:
    extension = source_path.suffix.lower()
    with Image.open(source_path) as image:
        image = ImageOps.exif_transpose(image)
        if image.width > MAX_WIDTH or image.height > MAX_HEIGHT:
            image.thumbnail((MAX_WIDTH, MAX_HEIGHT), Image.Resampling.LANCZOS)

        if extension in {".heic", ".heif"}:
            return convert_heic_to_jpeg(source_path, image, backup_dir, target_dir)

        if backup_dir is not None:
            backup_source(source_path, backup_dir, target_dir)

        temp_path = source_path.with_suffix(source_path.suffix + ".tmp")
        save_image(image, temp_path, extension)
        os.replace(temp_path, source_path)
        return source_path


def generate_manifest(manifest_dir: Path, filenames: list[str]) -> None:
    manifest = [
        {
            "file": filename,
            "title": build_display_name(filename),
            "alt": build_display_name(filename),
        }
        for filename in sorted(set(filenames), key=natural_key)
    ]

    manifest_path = manifest_dir / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"manifest更新: {manifest_path}")


def collect_manifest_sources(target_dir: Path) -> dict[str, list[str]]:
    grouped: dict[str, list[str]] = defaultdict(list)
    for path in target_dir.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in SUPPORTED_INPUT_EXTENSIONS:
            continue
        grouped[relative_category(path, target_dir)].append(path.name)
    return grouped


def main(argv: list[str]) -> int:
    target_dir = resolve_target_dir(argv)
    print_header(target_dir)

    backup_dir: Path | None = None
    total_before = 0
    total_after = 0

    print("画像を検索中...")
    print()

    files = list_input_images(target_dir)
    for source_path in files:
        size_before = source_path.stat().st_size
        total_before += size_before
        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print(f"ファイル: {source_path.name}")
        print(f"パス: {source_path}")
        print(f"現在のサイズ: {bytes_to_mb(size_before)}MB")

        try:
            if backup_dir is None:
                backup_dir = ensure_backup_dir(target_dir)
                print(f"バックアップディレクトリを作成: {backup_dir}")

            optimized_path = optimize_image(source_path, backup_dir, target_dir)
            size_after = optimized_path.stat().st_size
            total_after += size_after
            print("最適化中...")
            print("✓ 最適化完了")
            print(f"新しいサイズ: {bytes_to_mb(size_after)}MB")
            print(f"削減量: {bytes_to_mb(size_before - size_after)}MB ({bytes_to_percent(size_before, size_after)}%)")
        except Exception as exc:
            print(f"⚠ 最適化に失敗: {exc}")
            total_after += size_before

        print()

    print("manifest.json を生成中...")
    print()

    grouped = collect_manifest_sources(target_dir)
    for category in sorted(grouped.keys(), key=natural_key):
        manifest_dir = target_dir if category == ROOT_CATEGORY_KEY else target_dir / category
        manifest_dir.mkdir(parents=True, exist_ok=True)
        generate_manifest(manifest_dir, grouped[category])

    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("処理完了！")
    print()

    if backup_dir is not None and backup_dir.exists():
        print(f"バックアップ: {backup_dir}")
        print()
        print("統計:")
        print(f"  最適化前の合計: {bytes_to_mb(total_before)}MB")
        print(f"  最適化後の合計: {bytes_to_mb(total_after)}MB")
        print(f"  削減量: {bytes_to_mb(total_before - total_after)}MB")

    print()
    print("ヒント:")
    print("  - ブラウザでキャッシュをクリアしてから確認してください")
    print("  - 画像の品質に問題がある場合は、バックアップから復元できます")
    print("  - さらに最適化したい場合は、WebP形式への変換を検討してください")
    print()
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
