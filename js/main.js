document.addEventListener('DOMContentLoaded', () => {
  // 画像パスの自動設定
  function initImagePaths() {
    if (typeof imageConfig === 'undefined' || typeof getImagePath !== 'function') {
      console.warn('imageConfig が読み込まれていません');
      return;
    }

    // data-image-key 属性を持つ画像要素を処理
    document.querySelectorAll('img[data-image-key]').forEach(async (img) => {
      const imageKey = img.dataset.imageKey;
      try {
        const imagePath = getImagePath(imageKey);
        
        if (imagePath && imagePath !== img.src) {
          img.src = imagePath;
        }
      } catch (error) {
        console.warn('画像パスの取得に失敗:', imageKey, error);
      }
    });
  }

  // 画像パス初期化を実行（エラーでも続行）
  try {
    initImagePaths();
  } catch (error) {
    console.warn('画像パス初期化エラー:', error);
  }

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

  // アクティブセクションの検出とパララックス効果
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');
  const heroImage = document.querySelector('.hero-image');
  const pageTopButton = createPageTopButton();

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // パララックス効果（ヒーロー画像）
    if (heroImage && scrollY < window.innerHeight) {
      heroImage.style.transform = `translateY(${scrollY * 0.5}px) scale(1.1)`;
    }

    // ページトップボタンの表示/非表示
    if (scrollY > 300) {
      pageTopButton.classList.add('visible');
    } else {
      pageTopButton.classList.remove('visible');
    }

    // アクティブセクションの検出
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

  // ページトップボタンの作成
  function createPageTopButton() {
    const button = document.createElement('button');
    button.className = 'page-top';
    button.setAttribute('aria-label', 'ページトップへ戻る');
    button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    document.body.appendChild(button);
    return button;
  }

  // 画像URLを最適化する関数
  function optimizeImageUrl(originalUrl) {
    // 最適化が無効の場合は元のURLを返す
    if (typeof imageOptimizationConfig === 'undefined' || !imageOptimizationConfig.enabled) {
      return originalUrl;
    }

    // デバイスの画面幅を取得
    const screenWidth = window.innerWidth * (window.devicePixelRatio || 1);
    
    // 最適なサイズを決定
    let targetWidth = imageOptimizationConfig.maxWidth;
    if (screenWidth <= 768) {
      targetWidth = Math.min(imageOptimizationConfig.responsiveSizes.mobile, screenWidth);
    } else if (screenWidth <= 1024) {
      targetWidth = Math.min(imageOptimizationConfig.responsiveSizes.tablet, screenWidth);
    } else {
      targetWidth = Math.min(imageOptimizationConfig.responsiveSizes.desktop, screenWidth);
    }

    // Cloudflare Image Resizingを使用
    if (imageOptimizationConfig.useCloudflare) {
      // Cloudflare Image Resizing形式
      // /cdn-cgi/image/width=800,quality=85,format=auto/img/photos/...
      const format = imageOptimizationConfig.preferWebP ? 'auto' : 'jpeg';
      return `/cdn-cgi/image/width=${targetWidth},quality=${imageOptimizationConfig.quality},format=${format}/${originalUrl}`;
    }

    // フォールバック: ブラウザ側で制限（CSSで対応）
    return originalUrl;
  }

  // ディレクトリから画像を自動検出する関数（並列処理で高速化）
  async function detectImagesInDirectory(categoryKey) {
    const categoryPath = photoBasePath + categoryKey + '/';
    const detectedImages = [];
    
    console.log(`📸 検出開始: ${categoryKey}`);
    
    // チェックする拡張子
    const extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    
    // パターンごとにチェック
    const patterns = [
      { prefix: '', start: 1 },           // 1.jpg, 2.jpg, ...
      { prefix: 'photo', start: 1 },      // photo1.jpg, photo2.jpg, ...
      { prefix: 'IMG_', start: 1, pad: 4 } // IMG_0001.jpg, IMG_0002.jpg, ...
    ];
    
    // 並列でチェック（パフォーマンス向上）
    const checkPromises = [];
    
    for (const pattern of patterns) {
      for (const ext of extensions) {
        for (let index = pattern.start; index <= 20; index++) {
          let filename;
          if (pattern.pad) {
            filename = `${pattern.prefix}${String(index).padStart(pattern.pad, '0')}.${ext}`;
          } else {
            filename = `${pattern.prefix}${index}.${ext}`;
          }
          
          checkPromises.push(
            fetch(categoryPath + filename, { method: 'HEAD' })
              .then(response => response.ok ? filename : null)
              .catch(() => null)
          );
        }
      }
    }
    
    try {
      const results = await Promise.all(checkPromises);
      const foundFiles = results.filter(Boolean);
      
      // 重複を除去してソート
      const uniqueFiles = [...new Set(foundFiles)];
      uniqueFiles.sort((a, b) => {
        // 数値部分を抽出して比較
        const numA = parseInt(a.match(/\d+/) || 0);
        const numB = parseInt(b.match(/\d+/) || 0);
        return numA - numB;
      });
      
      console.log(`✅ ${categoryKey}: ${uniqueFiles.length}枚検出`, uniqueFiles);
      return uniqueFiles;
    } catch (error) {
      console.error(`❌ ${categoryKey}の検出エラー:`, error);
      return [];
    }
  }

  // 写真ギャラリーの動的生成（ディレクトリベース）
  async function initPhotoGallery() {
    console.log('🚀 フォトギャラリー初期化開始');
    
    if (typeof photoCategoryNames === 'undefined') {
      console.error('❌ photoCategoryNames が読み込まれていません');
      return;
    }

    const categoriesContainer = document.getElementById('photoCategories');
    const galleryContainer = document.getElementById('photoGallery');
    
    if (!categoriesContainer || !galleryContainer) {
      console.error('❌ 必要な要素が見つかりません');
      return;
    }

    let allPhotos = [];
    const categories = Object.keys(photoCategoryNames);

    // ローディング表示
    galleryContainer.innerHTML = '<p style="text-align: center; color: var(--color-text-light); grid-column: 1/-1;">📷 写真を読み込んでいます...</p>';

    try {
      // 各カテゴリーのディレクトリから画像を自動検出
      for (const categoryKey of categories) {
        const files = await detectImagesInDirectory(categoryKey);
        const categoryPath = photoBasePath + categoryKey + '/';
        
        files.forEach((filename, index) => {
          allPhotos.push({
            category: categoryKey,
            src: categoryPath + filename,
            alt: `${photoCategoryNames[categoryKey]} ${index + 1}`,
            categoryTitle: photoCategoryNames[categoryKey]
          });
        });
      }
      
      console.log(`✅ 合計 ${allPhotos.length}枚の写真を検出`);
    } catch (error) {
      console.error('❌ 画像検出エラー:', error);
      galleryContainer.innerHTML = '<p style="text-align: center; color: red; grid-column: 1/-1;">⚠️ 写真の読み込みに失敗しました</p>';
      return;
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

    // 画像の遅延読み込み用Intersection Observer
    const lazyImageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src;
          if (src && !img.src) {
            img.src = src;
            img.removeAttribute('data-src');
            lazyImageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px' // 画面に入る50px前に読み込み開始
    });

    // 写真を表示する関数
    function displayPhotos(categoryFilter = 'all') {
      const photosToDisplay = categoryFilter === 'all' 
        ? allPhotos 
        : allPhotos.filter(photo => photo.category === categoryFilter);

      if (photosToDisplay.length === 0) {
        galleryContainer.innerHTML = '<p style="text-align: center; color: var(--color-text-light); grid-column: 1/-1;">写真がまだ追加されていません</p>';
        return;
      }

      // プレースホルダー用の1x1透明画像
      const placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';

      galleryContainer.innerHTML = photosToDisplay.map((photo, index) => {
        // 画像URLを最適化
        const optimizedSrc = optimizeImageUrl(photo.src);
        
        return `
          <div class="photo-item reveal-on-scroll" data-index="${index}" data-category="${photo.category}">
            <div class="photo-image-wrapper">
              <img src="${placeholder}" data-src="${optimizedSrc}" alt="${photo.alt}" class="gallery-image lazy-image">
              <div class="photo-overlay">
                <span class="photo-icon">🔍</span>
              </div>
            </div>
          </div>
        `;
      }).join('');

      // 新しく追加された画像に遅延読み込みを適用
      const lazyImages = galleryContainer.querySelectorAll('.lazy-image');
      lazyImages.forEach(img => {
        lazyImageObserver.observe(img);
      });

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
    if (allPhotos.length === 0) {
      console.warn('⚠️ 検出された写真が0枚です');
      galleryContainer.innerHTML = '<p style="text-align: center; color: var(--color-text-light); grid-column: 1/-1;">📷 写真がまだ追加されていません。<br>img/photos/ フォルダに画像を追加してください。</p>';
    } else {
      console.log('🎉 写真表示開始');
      displayPhotos('all');
    }
  }

  // フォトギャラリー - ライトボックス機能
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  
  let currentPhotoIndex = 0;
  let photoSources = [];
  let slideDirection = null;

  function initLightbox(photos) {
    photoSources = photos.map(photo => {
      // ライトボックスでは少し大きめの画像を使用
      const lightboxConfig = {
        ...imageOptimizationConfig,
        maxWidth: imageOptimizationConfig.responsiveSizes.desktop
      };
      
      // 一時的に設定を上書き
      const originalConfig = { ...imageOptimizationConfig };
      Object.assign(imageOptimizationConfig, lightboxConfig);
      const optimizedSrc = optimizeImageUrl(photo.src);
      Object.assign(imageOptimizationConfig, originalConfig);
      
      return {
        src: optimizedSrc,
        alt: photo.alt
      };
    });

    const photoItems = document.querySelectorAll('.photo-item');
    photoItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        currentPhotoIndex = index;
        slideDirection = null; // 最初のクリックはズームイン
        showLightbox();
      });
    });
  }

  function showLightbox() {
    if (photoSources[currentPhotoIndex]) {
      // アニメーションクラスをリセット
      lightboxImg.classList.remove('slide-left', 'slide-right');
      
      // 少し待ってから新しい画像を設定（スムーズな切り替えのため）
      setTimeout(() => {
        lightboxImg.src = photoSources[currentPhotoIndex].src;
        lightboxImg.alt = photoSources[currentPhotoIndex].alt;
        
        // スライド方向に応じてクラスを追加
        if (slideDirection === 'next') {
          lightboxImg.classList.add('slide-left');
        } else if (slideDirection === 'prev') {
          lightboxImg.classList.add('slide-right');
        }
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }, slideDirection ? 50 : 0);
    }
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % photoSources.length;
    slideDirection = 'next';
    showLightbox();
  }

  function showPrevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + photoSources.length) % photoSources.length;
    slideDirection = 'prev';
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

  // タッチ/スワイプ操作
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;

  if (lightbox) {
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      if (!lightbox.classList.contains('active')) return;
      
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    const minSwipeDistance = 50;

    // 横スワイプが縦スワイプより大きい場合のみ反応
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
      if (diffX > 0) {
        // 右にスワイプ = 前の画像
        showPrevPhoto();
      } else {
        // 左にスワイプ = 次の画像
        showNextPhoto();
      }
    }
  }
});
