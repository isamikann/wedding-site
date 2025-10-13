# 📋 デプロイ前チェックリスト

Cloudflare Pagesに公開する前に確認しましょう！

---

## ✅ 必須チェック項目

### 📝 コンテンツ
- [ ] 日付が正しい（index.html内の全ての日付）
- [ ] 新郎新婦の名前が正しい
- [ ] プロフィール情報が最新
- [ ] Q&Aの内容が適切
- [ ] タイムラインの日付・内容が正しい
- [ ] メニュー内容が実際の料理と一致

### 🖼️ 画像
- [ ] メインビジュアル画像を配置（`img/main_visual.jpg`）
- [ ] 新郎の写真を配置（`img/groom.jpg`）
- [ ] 新婦の写真を配置（`img/bride.jpg`）
- [ ] フォトギャラリー画像を配置（`img/photos.jpg`）※式後でもOK
- [ ] エンドロール画像を配置（`img/endroll.jpg`）※式後でもOK
- [ ] 画像ファイルサイズを確認（各500KB以下推奨）

### 🔗 リンク・メタ情報
- [ ] OGP URLを実際の公開URLに変更（`index.html` 13-21行目）
- [ ] タイトルが適切（`<title>`タグ）
- [ ] ディスクリプションが適切（`<meta name="description">`）

### 🎨 スタイル
- [ ] ブラウザで表示確認（PC）
- [ ] スマホで表示確認（レスポンシブ）
- [ ] 全セクションが正しく表示される
- [ ] アニメーションが動作する

---

## 🚀 デプロイ手順

### 1. GitHubにプッシュ
```bash
cd /home/isamu/repo/wedding-site
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Cloudflare Pagesでデプロイ
1. [Cloudflare Pages](https://pages.cloudflare.com/) にログイン
2. プロジェクトを作成（または既存プロジェクトを開く）
3. GitHubリポジトリを接続
4. ビルド設定:
   - Build command: (空欄)
   - Build output directory: `/`
5. 「Save and Deploy」

### 3. 確認
- [ ] デプロイが成功したか確認
- [ ] 発行されたURLにアクセスして動作確認
- [ ] 全ページが正しく表示されるか
- [ ] 画像が全て読み込まれるか
- [ ] モバイルで表示確認

---

## 📱 公開後の確認

### ✅ 動作確認
- [ ] PCブラウザで全セクション確認
- [ ] スマホで全セクション確認
- [ ] 各セクションへのスクロールが動作
- [ ] ナビゲーションメニューが動作
- [ ] 画像が全て表示される
- [ ] ローディングアニメーションが表示される

### 🔍 SEO確認
- [ ] [Google リッチリザルト テスト](https://search.google.com/test/rich-results)でチェック
- [ ] [Facebook シェアデバッガー](https://developers.facebook.com/tools/debug/)でOGP確認
- [ ] [Twitter Card Validator](https://cards-dev.twitter.com/validator)でカード確認

### 🌐 SNSシェアテスト
- [ ] Facebookでシェアしてプレビュー確認
- [ ] TwitterでシェアしてOGP画像表示確認
- [ ] LINEで送信してプレビュー確認

---

## 🎯 オプション項目

### カスタムドメイン
- [ ] 独自ドメインを取得（お名前.com、Google Domains等）
- [ ] Cloudflare PagesでカスタムドメインをDNS設定
- [ ] HTTPS有効確認

### Analytics
- [ ] Google Analytics設定（トラッキングコード追加）
- [ ] Cloudflare Web Analytics有効化

### パフォーマンス
- [ ] [PageSpeed Insights](https://pagespeed.web.dev/)でスコア確認
- [ ] 90点以上が目標！

---

## 🎊 公開完了後

### ゲストへの共有
- [ ] URLを招待状に記載
- [ ] QRコードを生成（[QRコード作成](https://www.qr-code-generator.com/)）
- [ ] SNSで告知

### 運用
- [ ] 定期的にアクセス数を確認
- [ ] 式後に写真を追加（`img/photos.jpg`, `img/endroll.jpg`）
- [ ] フィードバックに応じて修正

---

## 📊 品質目標

| 項目 | 目標 |
|------|------|
| PageSpeed Insights | 90点以上 |
| モバイル対応 | 完璧 |
| OGP表示 | 全SNSで正常 |
| ロード時間 | 3秒以内 |

---

## 🆘 困ったときは

### よくある問題

**Q. 画像が表示されない**
```bash
# 画像をGitに追加
git add img/
git commit -m "Add images"
git push
```

**Q. 変更が反映されない**
- ブラウザのキャッシュクリア（Ctrl+Shift+R）
- Cloudflare Pagesのデプロイ状況確認

**Q. OGP画像が更新されない**
- [Facebook デバッガー](https://developers.facebook.com/tools/debug/)でキャッシュクリア

---

## 🎉 完了！

すべてチェックできたら、あとは結婚式当日を楽しみに待つだけです！

**素敵な結婚式を！💐✨**

---

最終チェック日: ____ 年 ____ 月 ____ 日  
チェック担当: ________________
