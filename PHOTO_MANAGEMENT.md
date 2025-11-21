# 写真管理ガイド

## 📸 写真の追加方法

### 1. カテゴリーフォルダに写真を入れる

写真を追加したいカテゴリーのフォルダに画像ファイルを入れてください。

```
wedding-site/
└── img/
    └── photos/
        ├── prewedding/     ← 前撮り写真
        │   ├── photo1.jpg
        │   ├── photo2.jpg
        │   └── ...
        ├── memories/       ← 思い出の写真
        │   ├── photo1.jpg
        │   └── ...
        └── ...
```

### 2. 設定ファイルにファイル名を追加

`photos-config.js` を開いて、`photoFiles` に追加した写真のファイル名を記述します。

```javascript
const photoFiles = {
  'prewedding': ['photo1.jpg', 'photo2.jpg'],  // ← ここに追加
  'memories': ['photo1.jpg']
};
```

### 新しいカテゴリーを追加する場合

#### ステップ1: フォルダを作成
`img/photos/` の中に新しいフォルダを作成します。

例: `img/photos/honeymoon/` （ハネムーンの写真用）

#### ステップ2: カテゴリー名を設定
`photos-config.js` を開いて設定を追加します。

```javascript
const photoCategoryNames = {
  'prewedding': '前撮り',
  'memories': '思い出',
  'honeymoon': 'ハネムーン',  // ← カテゴリー名を追加
};

const photoFiles = {
  'prewedding': ['photo1.jpg', 'photo2.jpg'],
  'memories': ['photo1.jpg'],
  'honeymoon': ['photo1.jpg', 'photo2.jpg']  // ← ファイルリストを追加
};
```

## 🎨 デフォルトカテゴリー

- **prewedding**: 前撮り写真
- **memories**: 二人の思い出
- **travel**: 旅行の写真
- **ceremony**: 挙式当日の写真
- **reception**: 披露宴の写真
- **casual**: 日常の写真

## 📝 対応ファイル形式

- `.jpg` / `.jpeg`
- `.png`
- `.webp`
- `.gif`

## 💡 ヒント

### ファイル名
推奨形式:
- ✅ `photo1.jpg`, `photo2.jpg`, `photo3.jpg` (連番推奨)
- ✅ `001.jpg`, `002.jpg`, `003.jpg`

### 画像サイズ
表示速度のため、幅1000-2000px程度に最適化推奨

## 🚀 使い方まとめ

1. カテゴリーフォルダに写真を入れる
2. `photos-config.js` の `photoFiles` にファイル名を追加
3. ブラウザをリロード

## 🔄 変更の反映

写真を追加したら、ブラウザをリロードするだけで表示されます！
