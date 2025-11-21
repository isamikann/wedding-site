document.addEventListener('DOMContentLoaded', () => {
  // 画像パスの自動設定
  function initImagePaths() {
    if (typeof imageConfig === 'undefined') {
      console.warn('imageConfig が読み込まれていません');
      return;
    }

    // data-image-key 属性を持つ画像要素を処理
    document.querySelectorAll('img[data-image-key]').forEach(async (img) => {
      const imageKey = img.dataset.imageKey;
      const imagePath = getImagePath(imageKey);
      
      if (imagePath && imagePath !== img.src) {
        // 画像が存在するかチェック
        const exists = await checkImageExists(imagePath);
        if (exists) {
          img.src = imagePath;
        }
      }
    });
  }

  // 画像パス初期化を実行
  initImagePaths();

  // ローディング画面の非表示
  window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        // ローディング要素を完全に削除
        setTimeout(() => {
          loadingScreen.remove();
        }, 500);
      }, 300);
    }
  });

  // 画像の遅延読み込みとローディング表示
  document.querySelectorAll('img').forEach(img => {
    // 画像読み込みエラー時のフォールバック
    img.addEventListener('error', function() {
      // プロフィール画像の場合
      if (this.classList.contains('profile-image')) {
        this.src = 'img/profile_placeholder.svg';
      } 
      // その他の画像の場合
      else if (!this.src.includes('placeholder.svg')) {
        this.src = 'img/placeholder.svg';
      }
    });
    
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });
    }
  });
  // ナビゲーションの開閉
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  
  navToggle?.addEventListener('click', () => {
    nav?.classList.toggle('is-open');
  });

  // スクロールアニメーション
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    threshold: 0.15
  });

  revealElements.forEach(el => observer.observe(el));

  // スムーズスクロール
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // モバイルメニューを閉じる
        nav?.classList.remove('is-open');
      }
    });
  });

  // アクティブセクションの検出
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href').slice(1) === current) {
        item.classList.add('active');
      }
    });
  });

  // 写真ギャラリーの動的生成（ディレクトリベース）
  async function initPhotoGallery() {
    if (typeof photoCategoryNames === 'undefined') {
      console.error('photoCategoryNames が読み込まれていません');
      return;
    }

    const categoriesContainer = document.getElementById('photoCategories');
    const galleryContainer = document.getElementById('photoGallery');
    
    if (!categoriesContainer || !galleryContainer) return;

    let allPhotos = [];
    const categories = Object.keys(photoCategoryNames);
    let activeCategory = 'all';

    // 各カテゴリーのディレクトリから画像を読み込む
    for (const categoryKey of categories) {
      try {
        const categoryPath = photoBasePath + categoryKey + '/';
        
        // ディレクトリ内の画像を取得する
        // 実際のファイルリストは静的に定義するか、サーバーサイドで取得する必要があります
        // ここでは画像の存在をチェックして自動検出します
        const detectedPhotos = await detectImagesInDirectory(categoryPath, categoryKey);
        
        detectedPhotos.forEach(photo => {
          allPhotos.push({
            category: categoryKey,
            src: photo.src,
            alt: photo.alt,
            categoryTitle: photoCategoryNames[categoryKey]
          });
        });
      } catch (error) {
        console.log(`カテゴリー ${categoryKey} の読み込みをスキップ`);
      }
    }

    // カテゴリータブを作成（写真が存在するカテゴリーのみ）
    const availableCategories = [...new Set(allPhotos.map(p => p.category))];
    const categoryTabsHTML = `
      <button class="category-tab active" data-category="all">すべて</button>
      ${availableCategories.map(categoryKey => {
        return `<button class="category-tab" data-category="${categoryKey}">${photoCategoryNames[categoryKey]}</button>`;
      }).join('')}
    `;
    categoriesContainer.innerHTML = categoryTabsHTML;

    // 写真を表示する関数
    function displayPhotos(categoryFilter = 'all') {
      const photosToDisplay = categoryFilter === 'all' 
        ? allPhotos 
        : allPhotos.filter(photo => photo.category === categoryFilter);

      if (photosToDisplay.length === 0) {
        galleryContainer.innerHTML = '<p style="text-align: center; color: var(--color-text-light); grid-column: 1/-1;">写真がまだ追加されていません</p>';
        return;
      }

      galleryContainer.innerHTML = photosToDisplay.map((photo, index) => `
        <div class="photo-item reveal-on-scroll" data-index="${index}" data-category="${photo.category}">
          <img src="${photo.src}" alt="${photo.alt}" class="gallery-image" loading="lazy">
          <div class="photo-overlay">
            <span class="photo-icon">🔍</span>
          </div>
        </div>
      `).join('');

      // 新しく追加された要素にスクロールアニメーションを適用
      const newRevealElements = galleryContainer.querySelectorAll('.reveal-on-scroll');
      newRevealElements.forEach(el => {
        observer.observe(el);
        // 既に表示領域にある場合は即座に表示
        setTimeout(() => {
          if (el.getBoundingClientRect().top < window.innerHeight) {
            el.classList.add('is-visible');
          }
        }, 100);
      });

      // ライトボックス機能を再初期化
      initLightbox(photosToDisplay);
    }

    // カテゴリータブのクリックイベント
    categoriesContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('category-tab')) {
        // アクティブなタブを切り替え
        categoriesContainer.querySelectorAll('.category-tab').forEach(tab => {
          tab.classList.remove('active');
        });
        e.target.classList.add('active');

        // カテゴリーで写真をフィルタリング
        const category = e.target.dataset.category;
        displayPhotos(category);
      }
    });

    // 初期表示
    displayPhotos('all');
  }

  // ディレクトリ内の画像を検出する関数
  async function detectImagesInDirectory(basePath, categoryKey) {
    const photos = [];
    const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    
    // 一般的な画像ファイル名のパターンをチェック
    // 実際のプロジェクトでは、画像のリストを別途管理するか、
    // サーバーサイドでディレクトリの内容を取得する必要があります
    
    // ここでは、ファイルの存在を試行してチェックする方法を使用
    for (let i = 1; i <= 50; i++) {
      for (const ext of imageExtensions) {
        const filename = `photo${i}.${ext}`;
        const fullPath = basePath + filename;
        
        try {
          // 画像の存在をチェック
          const exists = await checkImageExists(fullPath);
          if (exists) {
            photos.push({
              src: fullPath,
              alt: `${photoCategoryNames[categoryKey]} ${i}`
            });
            break; // この番号で見つかったら次の番号へ
          }
        } catch (e) {
          // エラーは無視
        }
      }
    }
    
    // 追加: 任意のファイル名パターンもチェック
    const commonNames = ['001', '002', '003', '004', '005', '1', '2', '3', '4', '5'];
    for (const name of commonNames) {
      for (const ext of imageExtensions) {
        const filename = `${name}.${ext}`;
        const fullPath = basePath + filename;
        
        try {
          const exists = await checkImageExists(fullPath);
          if (exists && !photos.find(p => p.src === fullPath)) {
            photos.push({
              src: fullPath,
              alt: `${photoCategoryNames[categoryKey]} ${name}`
            });
          }
        } catch (e) {
          // エラーは無視
        }
      }
    }
    
    return photos;
  }

  // 画像の存在をチェックする関数
  function checkImageExists(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
      // タイムアウトを設定
      setTimeout(() => resolve(false), 1000);
    });
  }

  // フォトギャラリー - ライトボックス機能
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  
  let currentPhotoIndex = 0;
  let photoSources = [];

  function initLightbox(photos) {
    photoSources = photos.map(photo => ({
      src: photo.src,
      alt: photo.alt
    }));

    const photoItems = document.querySelectorAll('.photo-item');
    photoItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        currentPhotoIndex = index;
        showLightbox();
      });
    });
  }

  function showLightbox() {
    if (photoSources[currentPhotoIndex]) {
      lightboxImg.src = photoSources[currentPhotoIndex].src;
      lightboxImg.alt = photoSources[currentPhotoIndex].alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % photoSources.length;
    showLightbox();
  }

  function showPrevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + photoSources.length) % photoSources.length;
    showLightbox();
  }

  // 写真ギャラリーを初期化
  initPhotoGallery();

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', showNextPhoto);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', showPrevPhoto);
  }

  // ライトボックス背景クリックで閉じる
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // キーボード操作
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNextPhoto();
    } else if (e.key === 'ArrowLeft') {
      showPrevPhoto();
    }
  });
});
