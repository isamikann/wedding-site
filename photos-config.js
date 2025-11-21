// 写真の設定ファイル
// このファイルで写真を管理します
// ジャンルごとに写真を追加してください

const photoConfig = {
  // 前撮り写真
  prewedding: {
    title: '前撮り',
    description: 'プレウェディングフォト',
    photos: [
      { filename: 'photo1.jpg', alt: '前撮り写真1' },
      { filename: 'photo2.jpg', alt: '前撮り写真2' },
      { filename: 'photo3.jpg', alt: '前撮り写真3' }
    ]
  },
  
  // 思い出の写真
  memories: {
    title: '思い出',
    description: '二人の大切な思い出',
    photos: [
      { filename: 'photo4.jpg', alt: '思い出の写真1' },
      { filename: 'photo5.jpg', alt: '思い出の写真2' },
      { filename: 'photo6.jpg', alt: '思い出の写真3' }
    ]
  },
  
  // 旅行の写真（例）
  // travel: {
  //   title: '旅行',
  //   description: '二人で訪れた場所',
  //   photos: [
  //     { filename: 'travel1.jpg', alt: '旅行写真1' },
  //     { filename: 'travel2.jpg', alt: '旅行写真2' }
  //   ]
  // }
};

// 画像のベースパス（img/photos/ ディレクトリを使用）
const photoBasePath = 'img/photos/';
