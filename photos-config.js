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
