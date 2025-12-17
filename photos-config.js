// 写真カテゴリーの設定
// フォルダ名がカテゴリーIDになります
// フォルダに画像を追加するだけで自動的に表示されます

const photoCategoryNames = {
  'prewedding': '前撮り',
  'memories': '思い出',
  'travel': '旅行',
  'ceremony': '挙式',
  'reception': '披露宴',
  'casual': '日常'
};

// 画像のベースパス
const photoBasePath = 'img/photos/';

// サポートされる画像拡張子
const supportedImageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// 画像最適化設定
const imageOptimizationConfig = {
  // 自動最適化を有効にする
  enabled: true,
  
  // Cloudflare Image Resizingを使用（Cloudflareでホストしている場合のみ）
  useCloudflare: false,  // デプロイ後にtrueに変更
  
  // 画像の最大幅（ピクセル）
  maxWidth: 1200,
  
  // 画質（1-100、デフォルト85）
  quality: 85,
  
  // WebPフォーマットを優先（対応ブラウザのみ）
  preferWebP: true,
  
  // レスポンシブサイズ（デバイスに応じた最適なサイズ）
  responsiveSizes: {
    mobile: 800,    // モバイル用
    tablet: 1200,   // タブレット用
    desktop: 1600   // デスクトップ用
  }
};
