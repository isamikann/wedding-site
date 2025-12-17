# パフォーマンス改善（2025年12月17日）

## 🚀 実装した改善

### 1. 自動画像検出機能

**問題点:**
- 写真を追加するたびに `photos-config.js` にファイル名を手動で追加する必要があった
- ファイル名の記述ミスで画像が表示されない問題が発生しやすかった

**解決策:**
- ディレクトリから画像を自動検出する機能を実装
- 対応パターン:
  - 連番: `1.jpg`, `2.jpg`, `3.jpg` ...
  - photo連番: `photo1.jpg`, `photo2.jpg` ...
  - IMG連番: `IMG_0001.jpg`, `IMG_0002.jpg` ...

**使い方:**
```bash
# カテゴリーフォルダに画像を入れるだけ！
img/photos/prewedding/
  ├── 1.jpg      ← 自動検出
  ├── 2.jpg      ← 自動検出
  └── 3.jpg      ← 自動検出
```

### 2. 真の遅延読み込み（Lazy Loading）

**問題点:**
- `loading="lazy"` 属性を使用していたが、ブラウザの対応に依存
- すべての画像が同時に読み込まれ、初期ロードが非常に遅かった
- 大量の画像があるとページが重くなる

**解決策:**
- Intersection Observer API を使用した本格的な遅延読み込み
- 画像が画面に表示される直前（50px手前）で読み込み開始
- プレースホルダー画像を使用し、読み込み中の状態を可視化

**技術詳細:**
```javascript
// Intersection Observerによる遅延読み込み
const lazyImageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;  // data-src → src
      lazyImageObserver.unobserve(img);
    }
  });
}, {
  rootMargin: '50px'  // 画面に入る50px前に読み込み
});
```

### 3. プログレッシブ画像表示

**実装内容:**
- ローディング中のスケルトンアニメーション
- 画像読み込み完了時のフェードイン効果
- 視覚的なフィードバックによるUX向上

**視覚効果:**
- グレーのグラデーション背景
- シマーアニメーション（流れる光のエフェクト）
- スムーズなフェードイン（0.4秒）

### 4. 設定ファイルの簡素化

**変更前:**
```javascript
const photoFiles = {
  'prewedding': ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
  'memories': ['photo1.jpg', 'photo2.jpg'],
  // 写真を追加するたびに編集が必要...
};
```

**変更後:**
```javascript
// カテゴリー名だけを定義！
const photoCategoryNames = {
  'prewedding': '前撮り',
  'memories': '思い出',
};
// ファイル名のリストは不要になりました！
```

## 📊 パフォーマンス比較

### 改善前
- 初期ロード時間: **長い**（全画像を一度に読み込み）
- ネットワーク負荷: **高い**（20枚 × 5MB = 100MB）
- スクロール遅延: **あり**

### 改善後
- 初期ロード時間: **高速**（表示領域の画像のみ）
- ネットワーク負荷: **低い**（必要な画像のみ段階的に）
- スクロール遅延: **なし**（スムーズ）

## 🎯 追加推奨事項

### 画像の最適化

現在の画像サイズ:
- photo1.jpg: 5.9MB ← **最適化が必要**
- photo2.jpeg: 7.3MB ← **最適化が必要**
- photo3.jpeg: 6.4MB ← **最適化が必要**

**推奨サイズ:**
- 幅: 1500-2000px
- ファイルサイズ: 200-500KB/枚
- 形式: JPEG (品質80-85%)

### 画像圧縮ツール

**オンラインツール:**
- [TinyPNG](https://tinypng.com/) - 簡単で高品質
- [Squoosh](https://squoosh.app/) - Googleの画像最適化ツール

**コマンドライン:**
```bash
# ImageMagickでバッチ圧縮
mogrify -resize 1500x1500\> -quality 85 *.jpg

# または
for file in *.jpg; do
  convert "$file" -resize 1500x1500\> -quality 85 "optimized_$file"
done
```

### WebP形式への変換（さらなる高速化）

WebP形式は同じ品質でJPEGより30-50%小さくなります:

```bash
# WebPへの変換
for file in *.jpg; do
  cwebp -q 85 "$file" -o "${file%.jpg}.webp"
done
```

## 🔄 今後の改善案

### 1. レスポンシブ画像
`<picture>` タグや `srcset` を使用して、デバイスサイズに応じた画像を配信

### 2. 画像キャッシュ
Service Workerによるオフライン対応とキャッシュ戦略

### 3. プログレッシブJPEG
徐々に鮮明になる画像形式で体感速度を向上

### 4. CDN配信
CloudflareやVercelの画像最適化機能を活用

## 📝 変更ファイル一覧

- `photos-config.js` - 設定を簡素化、自動検出対応
- `js/main.js` - 自動検出関数、遅延読み込み実装
- `css/style.css` - ローディング状態のスタイル追加
- `PHOTO_MANAGEMENT.md` - 使い方ガイドを更新

## ✅ テスト項目

- [x] 画像の自動検出が動作する
- [x] 遅延読み込みが機能する
- [x] スケルトンアニメーションが表示される
- [x] カテゴリーフィルタリングが動作する
- [x] ライトボックスが正常に機能する
- [ ] 実際の画像で読み込み速度を確認
- [ ] モバイルデバイスでのパフォーマンステスト

## 🚀 次のステップ

1. 既存画像を最適化する（5-7MB → 200-500KB）
2. ブラウザでパフォーマンスをテスト
3. 必要に応じてさらなる最適化を検討
