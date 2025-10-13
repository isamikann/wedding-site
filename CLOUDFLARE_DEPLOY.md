# Cloudflare Pages デプロイガイド

## 🚀 Cloudflare Pagesへのデプロイ手順

### 前提条件
- GitHubアカウント
- Cloudflareアカウント（無料）
- このプロジェクトがGitHubリポジトリにプッシュ済み

---

## ステップ1: Cloudflare Pagesにアクセス

1. [Cloudflare Pages](https://pages.cloudflare.com/) にアクセス
2. Cloudflareアカウントでログイン（なければ無料登録）

---

## ステップ2: プロジェクトを作成

1. 「Create a project」をクリック
2. 「Connect to Git」を選択
3. GitHubアカウントで認証
4. リポジトリを選択（例: `wedding-site`）

---

## ステップ3: ビルド設定

以下のように設定します：

| 項目 | 設定値 |
|------|--------|
| **Project name** | `wedding-site`（任意の名前） |
| **Production branch** | `main` |
| **Framework preset** | `None` |
| **Build command** | （空欄） |
| **Build output directory** | `/` |

> **重要**: このプロジェクトは静的HTMLなので、ビルドコマンドは不要です！

---

## ステップ4: 環境変数（不要）

このプロジェクトでは環境変数は不要です。スキップしてOK。

---

## ステップ5: デプロイ

1. 「Save and Deploy」をクリック
2. 数秒でデプロイ完了！
3. `https://wedding-site-XXX.pages.dev` のようなURLが発行されます

---

## 🎨 カスタムドメインの設定（オプション）

### 独自ドメインを使う場合

1. Cloudflare Pagesのプロジェクトページへ
2. 「Custom domains」タブをクリック
3. 「Set up a custom domain」をクリック
4. ドメイン名を入力（例: `wedding.example.com`）
5. DNS設定の指示に従う

### Cloudflareでドメイン管理している場合
- 自動的にDNS設定が追加されます（簡単！）

### 他社でドメイン管理している場合
- CNAMEレコードを追加:
  - Name: `wedding` (または `@`)
  - Value: `wedding-site-XXX.pages.dev`

---

## 🔄 自動デプロイ

GitHubにプッシュすると自動的にデプロイされます！

```bash
# ファイルを編集後
git add .
git commit -m "Update profile"
git push

# 自動的にCloudflare Pagesにデプロイされます
```

---

## 📊 デプロイ状況の確認

1. Cloudflare Pagesダッシュボード
2. プロジェクトを選択
3. 「Deployments」タブで履歴確認
4. ビルドログも確認可能

---

## 🌍 プレビューデプロイ

ブランチを作成すると、自動的にプレビューURLが生成されます：

```bash
git checkout -b feature/update-design
# 変更を加える
git push origin feature/update-design

# プレビューURL: https://BRANCH-NAME.wedding-site-XXX.pages.dev
```

---

## 🔧 トラブルシューティング

### Q. デプロイが失敗する
**A.** ビルド設定を確認：
- Build command: 空欄
- Build output directory: `/`

### Q. 404エラーが出る
**A.** リポジトリのルートに `index.html` があることを確認

### Q. 画像が表示されない
**A.** `img/` フォルダが正しくプッシュされているか確認
```bash
git add img/
git commit -m "Add images"
git push
```

### Q. 変更が反映されない
**A.** 以下を確認：
1. GitHubにプッシュ済みか
2. Cloudflare Pagesでデプロイ完了しているか
3. ブラウザのキャッシュをクリア（Ctrl+Shift+R）

---

## 🎯 パフォーマンス

Cloudflare Pagesの利点：

- ✅ **世界中で高速**: 200以上のデータセンターから配信
- ✅ **無料で無制限**: トラフィック制限なし
- ✅ **自動HTTPS**: SSL証明書自動発行
- ✅ **DDoS保護**: 自動的にセキュリティ強化
- ✅ **HTTP/3対応**: 最新プロトコル

---

## 📈 Analytics（アクセス解析）

Cloudflare Web Analyticsを無料で利用可能：

1. Cloudflare Pagesダッシュボード
2. 「Web Analytics」を有効化
3. トラッキングコードをコピー
4. `index.html` の `</body>` 前に貼り付け

---

## 🎉 完了！

これで結婚式WEBプロフィールサイトが世界中に公開されました！

URLをゲストにシェアして、素敵な結婚式を迎えてください 💐

---

## 📞 サポート

- [Cloudflare Pages ドキュメント](https://developers.cloudflare.com/pages/)
- [Cloudflare Community](https://community.cloudflare.com/)

---

**Happy Wedding! 🎊💍**
