# 画像管理ガイド

## 📁 ディレクトリ構造

全ての画像はカテゴリー別のディレクトリで管理されています。

```
wedding-site/
└── img/
    ├── main/           ← メインビジュアル（トップページ）
    ├── profile/        ← プロフィール写真（新郎・新婦）
    ├── menu/           ← メニュー関連の画像
    ├── seating/        ← 席次表の画像
    ├── endroll/        ← エンドロール画像
    └── photos/         ← フォトギャラリー
        ├── prewedding/ ← 前撮り写真
        ├── memories/   ← 思い出の写真
        ├── travel/     ← 旅行の写真
        └── ...         ← その他のカテゴリー
```

## 🖼️ 各セクションの画像管理

### 1. メインビジュアル（トップページの大きな画像）
**場所**: `img/main/`
**ファイル名**: `main_visual.jpg` （推奨）

```bash
# 画像を配置
cp your-photo.jpg img/main/main_visual.jpg
```

### 2. プロフィール写真
**場所**: `img/profile/`
**ファイル名**: 
- 新郎: `groom.jpg`
- 新婦: `bride.jpg`

```bash
# 新郎の写真を配置
cp groom-photo.jpg img/profile/groom.jpg

# 新婦の写真を配置
cp bride-photo.jpg img/profile/bride.jpg
```

### 3. エンドロール画像
**場所**: `img/endroll/`
**ファイル名**: `endroll.jpg` （推奨）

```bash
cp endroll-thumbnail.jpg img/endroll/endroll.jpg
```

### 4. フォトギャラリー
**場所**: `img/photos/[カテゴリー名]/`

詳しくは `PHOTO_MANAGEMENT.md` を参照してください。

## ✨ 画像の追加・変更方法

### 方法1: ファイルを直接置き換え
対応するディレクトリに画像ファイルを配置するだけ！

```bash
# 例: メインビジュアルを変更
cp new-main-image.jpg img/main/main_visual.jpg
```

### 方法2: 異なるファイル名を使用する場合
`images-config.js` でファイル名を指定できます。

```javascript
// images-config.js
images: {
  heroImage: {
    directory: 'main',
    defaultFile: 'my-custom-name.jpg',  // ← ファイル名を変更
    alt: '説明文'
  }
}
```

## 🎨 対応ファイル形式

- `.jpg` / `.jpeg` （推奨）
- `.png`
- `.webp`
- `.gif`

## 💡 画像サイズの推奨値

| 用途 | 推奨サイズ |
|------|-----------|
| メインビジュアル | 幅 1920-2560px |
| プロフィール写真 | 幅 800-1200px（正方形推奨） |
| フォトギャラリー | 幅 1000-2000px |
| その他 | 幅 800-1500px |

## 🔄 変更の反映

画像を配置・変更したら、ブラウザをリロードするだけで自動的に反映されます！

## 📝 クイックリファレンス

```bash
# 全ての画像ディレクトリを確認
ls -la img/*/

# メインビジュアルを変更
cp new-image.jpg img/main/main_visual.jpg

# プロフィール写真を変更
cp new-groom.jpg img/profile/groom.jpg
cp new-bride.jpg img/profile/bride.jpg

# フォトギャラリーに写真を追加
cp photo1.jpg img/photos/prewedding/
cp photo2.jpg img/photos/memories/
```

## 🛠️ トラブルシューティング

### 画像が表示されない場合

1. **ファイルパスを確認**
   ```bash
   ls -la img/main/main_visual.jpg
   ```

2. **ファイル名を確認**
   - 大文字・小文字を区別します
   - スペースは使用しないでください

3. **ファイル形式を確認**
   - 対応形式: jpg, jpeg, png, webp, gif

4. **ブラウザのキャッシュをクリア**
   - Ctrl + Shift + R (Windows/Linux)
   - Cmd + Shift + R (Mac)

### プレースホルダーが表示される場合

画像ファイルが見つからない場合、自動的にプレースホルダー画像が表示されます。
正しいディレクトリに画像が配置されているか確認してください。

## 🚀 まとめ

1. 適切なディレクトリを選ぶ
2. 画像ファイルを配置
3. ブラウザをリロード

**設定ファイルの編集は基本的に不要です！**
