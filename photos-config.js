// 写真カテゴリーの設定
// フォルダ名がカテゴリーIDになります

const photoCategoryNames = {
  'prewedding': '前撮り',
  'memories': '思い出',
  'travel': '旅行',
  'ceremony': '挙式',
  'reception': '披露宴',
  'casual': '日常'
};

// 各カテゴリーの写真リスト
// カテゴリーフォルダに写真を追加したら、ここにファイル名を追加してください
const photoFiles = {
  'prewedding': ['photo1.jpg', 'photo2.jpg'],
  'memories': ['photo1.jpg']
  // 写真を追加したら以下のように記述:
  // 'travel': ['photo1.jpg', 'photo2.jpg', 'photo3.jpg']
};

// 画像のベースパス
const photoBasePath = 'img/photos/';
