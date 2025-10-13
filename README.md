# 結婚式WEBプロフィールサイト 💍

ISAMUとREINAの結婚式用プロフィールサイト

![Wedding Profile](https://img.shields.io/badge/Wedding-2026.5.16-FF9966?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## ✨ 特徴

- 🎨 **洗練されたデザイン** - エレガントで温かみのあるカラースキーム
- 📱 **完全レスポンシブ** - PC、タブレット、スマートフォンに最適化
- ⚡ **スムーズなアニメーション** - スクロールに応じたフェードイン効果
- ♿ **アクセシビリティ対応** - すべての方に優しい設計
- 🚀 **高速表示** - 最適化されたコードで素早く読み込み

---

## 📂 プロジェクト構成

```
wedding-site/
├── index.html          # メインページ
├── CUSTOMIZE.md        # カスタマイズガイド
├── README.md           # このファイル
├── css/
│   └── style.css      # スタイルシート
├── js/
│   └── main.js        # JavaScript
└── img/               # 画像フォルダ
    ├── favicon.svg           # ファビコン
    ├── placeholder.svg       # プレースホルダー画像
    └── profile_placeholder.svg
```

---

## 🚀 クイックスタート

### 1. ファイルをダウンロード

```bash
# GitHubからクローン
git clone https://github.com/yourusername/wedding-site.git
cd wedding-site
```

### 2. ローカルで確認

ブラウザで `index.html` を開くだけ！

または、ローカルサーバーで起動：
```bash
# Pythonがある場合
python3 -m http.server 8000

# Node.jsがある場合（http-server）
npx http-server -p 8000
```

ブラウザで `http://localhost:8000` を開く

### 3. カスタマイズ

詳しくは **[CUSTOMIZE.md](CUSTOMIZE.md)** をご覧ください。

---

## 📄 ページ構成

### index.html - メインページ
- 🎯 ヒーローセクション
- 🪑 席次表
- 🍽️ お料理メニュー
- 👥 プロフィール
- 💬 Q&A
- 📅 二人の歩み（タイムライン）
- 📸 フォトギャラリー
- 🎬 エンドロール

---

## 🎨 デザインのハイライト

### カラーパレット
- **アクセント**: `#FF9966` - 温かみのあるオレンジ
- **背景**: `#F2F9FD` - 柔らかなブルー
- **テキスト**: `#222222` - 読みやすい黒

### タイポグラフィ
- **セリフ体**: Cormorant Garamond（見出し）
- **サンセリフ体**: Noto Sans JP（本文）

---

## 💡 カスタマイズ例

### 日付を変更
```html
<span class="date">2026.5.16</span>
<!-- ↓ -->
<span class="date">2027.6.20</span>
```

### カラーテーマ変更
```css
:root {
  --color-accent: #FF6B9D; /* ピンク系に変更 */
}
```

詳細は [CUSTOMIZE.md](CUSTOMIZE.md) を参照してください。

---

## 🌐 公開方法

### Cloudflare Pages（推奨・無料）

1. [Cloudflare Pages](https://pages.cloudflare.com/) にログイン
2. GitHubリポジトリを接続
3. ビルド設定:
   - **Build command**: (空欄)
   - **Build output directory**: `/`
4. デプロイを実行
5. `https://yoursite.pages.dev` でアクセス可能
6. カスタムドメインも設定可能

### GitHub Pages（無料・シンプル）

1. GitHubにリポジトリ作成
2. ファイルをプッシュ
3. Settings > Pages で有効化
4. `https://yourusername.github.io/wedding-site/` でアクセス可能

### その他のホスティングサービス
- [Netlify](https://www.netlify.com/)
- [Vercel](https://vercel.com/)

---

## 📝 TODO（オプショナル）

- [ ] 実際の画像を `img/` フォルダに配置
- [ ] プロフィール情報をカスタマイズ
- [ ] 席次表を実際のゲスト情報に更新
- [ ] Cloudflare Pagesで公開
- [ ] 独自ドメイン設定
- [ ] Google Analytics追加（アクセス解析）

> **💡 メッセージ機能が必要な場合**  
> Google Forms や Formspree などの外部サービスと連携可能です。詳しくはCUSTOMIZE.mdをご覧ください。

---

## 🛠️ 技術スタック

- **HTML5** - セマンティックなマークアップ
- **CSS3** - モダンなスタイリング（Flexbox, Grid, Variables）
- **JavaScript (Vanilla)** - フレームワーク不要のシンプルな実装
- **Google Fonts** - Webフォント

---

## 📱 ブラウザサポート

- ✅ Chrome（最新版）
- ✅ Firefox（最新版）
- ✅ Safari（最新版）
- ✅ Edge（最新版）
- ✅ モバイルブラウザ

---

## 🤝 コントリビューション

このプロジェクトは個人用テンプレートですが、改善案や提案は歓迎します！

---

## 📄 ライセンス

このテンプレートは個人利用に限り自由にカスタマイズできます。

---

## 👏 謝辞

- Google Fonts
- アイコン素材提供者の皆様

---

## 📞 お問い合わせ

質問がある場合は [CUSTOMIZE.md](CUSTOMIZE.md) のトラブルシューティングセクションを確認してください。

---

**素敵な結婚式を！ 🎉💐✨**

Made with ❤️ for ISAMU & REINA
