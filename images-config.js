// 画像管理設定
// 各セクションで使用する画像のパスを自動的に管理します

const imageConfig = {
  // 基本パス
  basePath: 'img/',
  
  // 各セクションのディレクトリマッピング
  directories: {
    main: 'main/',           // メインビジュアル
    profile: 'profile/',     // プロフィール画像
    menu: 'menu/',           // メニュー画像
    seating: 'seating/',     // 席次表画像
    endroll: 'endroll/',     // エンドロール画像
    photos: 'photos/'        // フォトギャラリー
  },
  
  // 画像の役割マッピング（HTMLの要素と紐付け）
  images: {
    // メインビジュアル
    heroImage: {
      directory: 'main',
      defaultFile: 'main_visual.jpg',
      alt: 'ISAMUとREINAのウェディングフォト - 幸せそうに微笑む二人'
    },
    
    // プロフィール画像
    groomProfile: {
      directory: 'profile',
      defaultFile: 'groom.jpg',
      alt: '新郎ISAMU - 笑顔でカメラを見つめる優しい表情'
    },
    brideProfile: {
      directory: 'profile',
      defaultFile: 'bride.jpg',
      alt: '新婦REINA - 上品な笑顔が印象的なポートレート'
    },
    
    // その他のセクション画像（今後追加可能）
    menuImage: {
      directory: 'menu',
      defaultFile: 'menu.jpg',
      alt: 'お料理メニュー'
    },
    seatingImage: {
      directory: 'seating',
      defaultFile: 'seating.jpg',
      alt: '席次表'
    },
    endrollImage: {
      directory: 'endroll',
      defaultFile: 'endroll.jpg',
      alt: 'エンドロールムービーのサムネイル画像'
    }
  },
  
  // プレースホルダー画像
  placeholders: {
    profile: 'profile_placeholder.svg',
    general: 'placeholder.svg'
  }
};

// 画像パスを取得するヘルパー関数
function getImagePath(imageKey) {
  const image = imageConfig.images[imageKey];
  if (!image) return '';
  
  const directory = imageConfig.directories[image.directory];
  return imageConfig.basePath + directory + image.defaultFile;
}

// ディレクトリ内の最初の画像を自動検出する関数
async function getFirstImageInDirectory(directoryKey) {
  const directory = imageConfig.directories[directoryKey];
  if (!directory) return null;
  
  const basePath = imageConfig.basePath + directory;
  const extensions = ['jpg', 'jpeg', 'png', 'webp'];
  
  // よくあるファイル名パターンをチェック
  const commonNames = ['main_visual', 'image', 'photo', '1', '01', '001'];
  
  for (const name of commonNames) {
    for (const ext of extensions) {
      const path = basePath + name + '.' + ext;
      const exists = await checkImageExists(path);
      if (exists) return path;
    }
  }
  
  return null;
}

function checkImageExists(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
    setTimeout(() => resolve(false), 500);
  });
}
