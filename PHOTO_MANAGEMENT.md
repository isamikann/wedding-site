# 写真管理ガイド（改善版）

## 🚀 新機能: 自動画像検出

**ファイル名の制約をゆるめました。**
フォルダ内の画像を `manifest.json` 経由で読み込むので、任意のファイル名でも表示できます。
`optimize-images.sh` がファイル名をもとに表示名も自動生成します。
HEIC/HEIF は JPEG に変換されます。

## 📸 写真の追加方法

### 1. カテゴリーフォルダに写真を入れる

写真を追加したいカテゴリーのフォルダに画像ファイルを入れるだけでOKです。

```
wedding-site/
└── img/
    └── photos/
        ├── prewedding/     ← 前撮り写真
        │   ├── 1.jpg       ← 自動検出されます
        │   ├── vacation.jpg ← 自動検出されます
        │   ├── photo1.jpg  ← 自動検出されます
        │   └── IMG_0001.jpg ← 自動検出されます
        ├── memories/       ← 思い出の写真
        │   ├── 1.jpg
        │   └── 2.jpg
        └── ...
```

### 対応ファイル名パターン

**✅ 対応パターン:**
- `photo1.jpg`, `photo2.jpg`, `photo3.jpg`, ...
- `vacation.jpg`, `ceremony-01.png`, `IMG_0001.webp` など任意の名前

**重要:** 任意ファイル名を使う場合は、フォルダ直下に `manifest.json` が必要です。

### 対応ファイル形式

- `.jpg` / `.jpeg`
- `.png`
- `.webp`

### 🎯 自動検出の仕組み

- `manifest.json` がある場合は、その一覧を優先して表示
- `manifest.json` がない場合は、従来どおり `photo1` からの連番探索にフォールバック
- 表示名はファイル名から自動整形されます
- 実際に存在するファイルのみを表示
- ファイル数に制限なし（100枚まで推奨）

### ⚠️ 注意事項

- ファイル名は **photo1, photo2, photo3...** の形式で
- 番号は1から始めて、**飛ばさないでください**（例: photo1, photo2, photo4 ❌）
- 番号を飛ばすと、その後の画像が検出されません

## 🎯 新しいカテゴリーを追加する場合

### ステップ1: フォルダを作成
`img/photos/` の中に新しいフォルダを作成します。

例: `img/photos/honeymoon/` （ハネムーンの写真用）

### ステップ2: カテゴリー名を設定
`photos-config.js` を開いて、カテゴリー名だけを追加します。

```javascript
const photoCategoryNames = {
  'prewedding': '前撮り',
  'memories': '思い出',
  'honeymoon': 'ハネムーン',  // ← これだけ追加すればOK！
};
```

### ステップ3: 写真を追加
作成したフォルダに写真を入れます。任意ファイル名を使う場合は、`optimize-images.sh` を実行して `manifest.json` を生成してください。
HEIC/HEIF も自動的に JPEG に変換されます。

```
img/photos/honeymoon/
  ├── vacation.jpg
  ├── ceremony.png
  └── dinner.webp
```

## 🎨 デフォルトカテゴリー

- **prewedding**: 前撮り写真
- **memories**: 二人の思い出
- **travel**: 旅行の写真
- **ceremony**: 挙式当日の写真
- **reception**: 披露宴の写真
- **casual**: 日常の写真

## 💡 ヒント

### ファイル名の付け方
以下のパターンに対応しています。

**✅ 推奨:**
- `1.jpg`, `2.jpg`, `3.jpg` ... （シンプルな連番）
- `photo1.jpg`, `photo2.jpg`, `photo3.jpg` ...
- `IMG_0001.jpg`, `IMG_0002.jpg` ... （カメラのデフォルト形式）
- `beach_sunset.jpg`, `my_photo.jpg` ...（任意名。manifest.json 必須）

### 画像サイズ
- **推奨サイズ**: 幅1000-2000px程度
- 大きすぎると読み込みが遅くなります
- 画像圧縮ツールでの最適化を推奨

### パフォーマンス最適化
- 自動遅延読み込みが適用されます
- 画面に表示される直前に読み込まれるため、大量の写真でも高速です

## 🚀 使い方まとめ

1. カテゴリーフォルダに写真を入れる（対応するファイル名で）
2. `optimize-images.sh` を実行する
3. ローカルサーバーで `index.html` を開く
4. ブラウザをリロードすると自動的に表示されます！

### ブラウザで見る方法

`file://` で直接開くのではなく、ローカルサーバー経由で確認してください。

```bash
python3 -m http.server 8000
```

そのあと、ブラウザで `http://localhost:8000` を開きます。

## 🔄 変更の反映

写真を追加したら、ブラウザをリロード（F5 or Ctrl+R）するだけで自動的に表示されます！
