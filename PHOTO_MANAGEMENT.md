# 写真管理ガイド

## 📸 写真の追加方法

### 1. 写真ファイルの配置
写真ファイルを `img/photos/` ディレクトリに配置してください。

```
wedding-site/
└── img/
    └── photos/
        ├── photo1.jpg
        ├── photo2.jpg
        ├── photo3.jpg
        └── ... (追加したい写真)
```

### 2. 設定ファイルの編集
`photos-config.js` ファイルを開いて、写真の情報を追加します。

#### 既存のカテゴリーに写真を追加する場合:

```javascript
prewedding: {
  title: '前撮り',
  description: 'プレウェディングフォト',
  photos: [
    { filename: 'photo1.jpg', alt: '前撮り写真1' },
    { filename: 'photo2.jpg', alt: '前撮り写真2' },
    { filename: 'new_photo.jpg', alt: '新しい前撮り写真' }, // ← 追加
  ]
}
```

#### 新しいカテゴリーを作成する場合:

```javascript
const photoConfig = {
  // 既存のカテゴリー
  prewedding: { ... },
  memories: { ... },
  
  // 新しいカテゴリーを追加
  travel: {
    title: '旅行',
    description: '二人で訪れた場所',
    photos: [
      { filename: 'travel1.jpg', alt: '京都旅行' },
      { filename: 'travel2.jpg', alt: '沖縄旅行' }
    ]
  }
};
```

## 🎨 カテゴリーの種類

現在設定されているカテゴリー:

- **prewedding**: 前撮り写真
- **memories**: 二人の思い出

追加例:
- **travel**: 旅行の写真
- **ceremony**: 挙式当日の写真
- **reception**: 披露宴の写真
- **casual**: 日常の写真

## 📝 設定項目の説明

### カテゴリーの設定
- `title`: カテゴリータブに表示される名前
- `description`: カテゴリーの説明（将来的に使用可能）
- `photos`: このカテゴリーに含まれる写真の配列

### 写真の設定
- `filename`: `img/photos/` 内のファイル名
- `alt`: 画像の代替テキスト（アクセシビリティとSEO用）

## 💡 ヒント

1. **ファイル名**: 英数字とハイフン、アンダースコアを使用（日本語は避ける）
   - ✅ `photo1.jpg`, `wedding-day-01.jpg`, `travel_kyoto.jpg`
   - ❌ `写真1.jpg`, `結婚式.jpg`

2. **画像サイズ**: 表示速度のため、幅1000-2000px程度に最適化推奨

3. **対応フォーマット**: `.jpg`, `.jpeg`, `.png`, `.webp`

4. **一括追加**: 複数の写真を一度に追加する場合は、配列に続けて記述してください

## 🔄 変更の反映

1. `photos-config.js` を編集
2. 写真ファイルを `img/photos/` に配置
3. ブラウザをリロード

設定ファイルを変更するだけで、自動的にギャラリーが更新されます！
