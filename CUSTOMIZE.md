# 結婚式WEBプロフィールサイト - カスタマイズガイド

## 📋 目次
- [概要](#概要)
- [セットアップ](#セットアップ)
- [カスタマイズ方法](#カスタマイズ方法)
- [画像の準備](#画像の準備)
- [公開方法](#公開方法)
- [トラブルシューティング](#トラブルシューティング)

---

## 概要

このサイトは、結婚式のゲストの方々に二人のプロフィールやストーリーを共有するためのWebサイトです。

### 主な機能
- ✨ レスポンシブデザイン（PC・スマホ対応）
- 📱 スムーズスクロール & アニメーション
- 📸 画像ギャラリー
- 💬 ゲストメッセージフォーム
- 🎨 エレガントなデザイン
- ♿ アクセシビリティ対応

---

## セットアップ

### 必要なファイル構成
```
wedding-site/
├── index.html          # メインページ
├── css/
│   └── style.css      # スタイルシート
├── js/
│   └── main.js        # JavaScript
└── img/               # 画像フォルダ
    ├── main_visual.jpg   # ヒーロー画像
    ├── groom.jpg         # 新郎写真
    ├── bride.jpg         # 新婦写真
    ├── photos.jpg        # フォトギャラリー
    ├── endroll.jpg       # エンドロール画像
    └── favicon.svg       # ファビコン
```

### ローカルで確認する方法

1. **簡単な方法（推奨）**
   - `index.html` をブラウザで開く

2. **ローカルサーバーで確認（より本番に近い環境）**
   ```bash
   # Pythonがインストール済みの場合
   cd wedding-site
   python3 -m http.server 8000
   # ブラウザで http://localhost:8000 を開く
   ```

---

## カスタマイズ方法

### 1️⃣ 基本情報の変更

#### 日付の変更
`index.html` の以下の箇所を編集：
```html
<h1 class="site-title">Wedding Profile<span class="date">2026.5.16</span></h1>
<p class="hero-date">2026.5.16</p>
```

#### 名前の変更
`index.html` のプロフィールセクション：
```html
<h4>Groom — ISAMU</h4>
<h4>Bride — REINA</h4>
```

### 2️⃣ カラーテーマの変更

`css/style.css` のルート変数を編集：
```css
:root {
  --color-accent: #FF9966;      /* アクセントカラー */
  --color-primary: #333333;     /* メインテキスト色 */
  --color-background: #f2f9fd;  /* 背景色 */
  /* 好みの色に変更できます */
}
```

### 3️⃣ プロフィール情報の編集

`index.html` のプロフィールセクションを編集：
```html
<dl class="profile-details">
  <div class="detail-item">
    <dt>出身地</dt>
    <dd>愛知県</dd> <!-- ここを変更 -->
  </div>
  <div class="detail-item">
    <dt>趣味</dt>
    <dd>読書、コンテンツ、Podcast</dd> <!-- ここを変更 -->
  </div>
  <!-- 項目を追加・削除できます -->
</dl>
```

### 4️⃣ タイムラインの編集

`index.html` のタイムラインセクション：
```html
<div class="timeline-item reveal-on-scroll">
  <div class="timeline-date">
    <span class="year">2021</span>
    <span class="month">10</span>
  </div>
  <div class="timeline-content">
    <h4>運命の出会い</h4>
    <p>最初の印象は「笑顔が素敵な人」でした</p>
  </div>
</div>
<!-- 上記をコピーして項目を追加できます -->
```

### 5️⃣ Q&Aの追加・編集

新しい質問を追加する場合：
```html
<details class="qa-item reveal-on-scroll">
  <summary>新しい質問をここに入力</summary>
  <div class="qa-content">
    <div class="qa-person groom">
      <span class="qa-label">ISAMU</span>
      <p>新郎の回答</p>
    </div>
    <div class="qa-person bride">
      <span class="qa-label">REINA</span>
      <p>新婦の回答</p>
    </div>
  </div>
</details>
```

### 6️⃣ メニュー内容の変更

`index.html` のメニューセクション：
```html
<li>
  <span class="menu-title">Appetizer</span>
  <span class="menu-detail">季節の前菜盛り合わせ</span> <!-- ここを編集 -->
</li>
```

### 7️⃣ 席次表の更新

実際のゲスト情報に合わせて編集：
```html
<tbody>
  <tr><td>1</td><td>佐藤さん、鈴木さん</td></tr>
  <tr><td>2</td><td>田中さん、山田さん</td></tr>
  <!-- 行を追加・編集 -->
</tbody>
```

---

## 画像の準備

### 推奨サイズと形式

| 画像ファイル | 推奨サイズ | 用途 |
|------------|----------|------|
| `main_visual.jpg` | 1920×1080px | ヒーロー背景画像 |
| `groom.jpg` | 800×800px (正方形) | 新郎プロフィール写真 |
| `bride.jpg` | 800×800px (正方形) | 新婦プロフィール写真 |
| `photos.jpg` | 1440×960px | フォトギャラリー |
| `endroll.jpg` | 1440×960px | エンドロール画像 |

### 画像の最適化

- **ファイルサイズ**: 各画像は500KB以下を推奨
- **形式**: JPEG（写真）、PNG（ロゴなど）
- **圧縮ツール**: [TinyPNG](https://tinypng.com/) などで圧縮

### 画像の配置方法

1. 準備した画像を `img/` フォルダに配置
2. ファイル名を上記の通りにリネーム
3. ブラウザで確認

> 💡 **Tip**: 画像がない場合は、自動的にプレースホルダーが表示されます

---

## SEO・OGP設定のカスタマイズ

`index.html` のヘッド部分を編集：

```html
<!-- 公開URLに変更 -->
<meta property="og:url" content="https://yourwedding.example.com/">

<!-- 説明文をカスタマイズ -->
<meta name="description" content="ISAMUとREINAの結婚式プロフィール。2026年5月16日に挙式。">
```

---

## 公開方法

### Cloudflare Pages（推奨・高速・無料）

#### 手順
1. [Cloudflare Pages](https://pages.cloudflare.com/) にアクセス
2. GitHubアカウントで連携
3. リポジトリを選択
4. ビルド設定:
   - **Framework preset**: None
   - **Build command**: (空欄)
   - **Build output directory**: `/`
5. 「Save and Deploy」をクリック

#### メリット
- ✅ 世界中で超高速（CDN自動配信）
- ✅ 無制限のリクエスト（無料）
- ✅ 自動HTTPS対応
- ✅ カスタムドメイン無料
- ✅ プレビューURL自動生成

### GitHub Pages（シンプル・無料）

```bash
# GitHubにリポジトリを作成
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/wedding-site.git
git push -u origin main

# GitHub Pages を有効化
# Settings > Pages > Source: main branch
```

### その他のサービス

#### Netlify
- [Netlify](https://www.netlify.com/) にログイン
- フォルダをドラッグ&ドロップ
- 自動的に公開URL発行

#### Vercel
- [Vercel](https://vercel.com/) にログイン
- GitHubリポジトリを接続
- 自動デプロイ

---

## ゲストメッセージ機能の追加（オプション）

静的サイトでもメッセージ機能を追加したい場合の方法：

### 方法1: Google Forms（最も簡単）
1. Google Formsでフォームを作成
2. 「送信」→「埋め込み」でiframeコードをコピー
3. index.htmlの適当な場所に追加:
```html
<section id="messages" class="section container">
  <h3 class="section-title"><span>Messages</span>お祝いメッセージ</h3>
  <iframe src="YOUR_GOOGLE_FORM_URL" width="100%" height="800"></iframe>
</section>
```

### 方法2: Formspree（メールで受信）
1. [Formspree](https://formspree.io/) でアカウント作成
2. フォームを作成してIDを取得
3. HTMLフォームを追加:
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
  <input type="text" name="name" placeholder="お名前" required>
  <textarea name="message" placeholder="メッセージ"></textarea>
  <button type="submit">送信</button>
</form>
```

### 方法3: Cloudflare Workers + KV（高度）
Cloudflareの無料機能でバックエンドAPIを構築可能です。

---

## トラブルシューティング

### Q. 画像が表示されない
**A.** 以下を確認してください：
- ファイル名が正確か（大文字小文字も区別）
- 画像が `img/` フォルダに配置されているか
- ファイル形式が `.jpg` または `.png` か

### Q. スマホで表示が崩れる
**A.** ブラウザのキャッシュをクリアしてください：
- Chrome: 設定 > プライバシーとセキュリティ > 閲覧履歴データの削除

### Q. アニメーションが動かない
**A.** JavaScriptが有効か確認してください：
- ブラウザの開発者ツール（F12）でエラーを確認

### Q. ゲストメッセージが送信されない
**A.** 現在はデモ実装です。実際の送信機能を実装する場合は：
- Google Forms と連携
- FormspreeなどのサービスURLを設定
- バックエンドAPI を構築

---

## より高度なカスタマイズ

### フォントの変更

`css/style.css` の Google Fonts を変更：
```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font&display=swap');

:root {
  --font-serif: "Your Font", serif;
  --font-sans: "Your Sans Font", sans-serif;
}
```

### セクションの追加

既存のセクションをコピーして、新しいコンテンツを追加できます：
```html
<section id="new-section" class="section container">
  <h3 class="section-title"><span>English Title</span>日本語タイトル</h3>
  <!-- コンテンツ -->
</section>
```

---

## サポート

質問や問題がある場合は、以下をお試しください：
1. このREADMEを再度確認
2. ブラウザの開発者ツール（F12）でエラーログを確認
3. コードをバックアップしてから再度試す

---

## ライセンス

このテンプレートは個人利用に限り自由にカスタマイズできます。

---

**素敵な結婚式になりますように！ 🎉💐**
