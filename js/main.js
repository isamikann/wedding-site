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

  // ディレクトリから画像を自動検出する関数
  async function detectImagesInDirectory(categoryKey) {
    const categoryPath = photoBasePath + categoryKey + '/';
    const detectedImages = [];
    
    // 一般的な画像ファイル名パターンをチェック
    const patterns = [
      // 連番パターン (1.jpg, 2.jpg, ...)
      Array.from({length: 50}, (_, i) => `${i + 1}.jpg`),
      Array.from({length: 50}, (_, i) => `${i + 1}.jpeg`),
      Array.from({length: 50}, (_, i) => `${i + 1}.png`),
      Array.from({length: 50}, (_, i) => `${i + 1}.webp`),
      // photo連番パターン
      Array.from({length: 50}, (_, i) => `photo${i + 1}.jpg`),
      Array.from({length: 50}, (_, i) => `photo${i + 1}.jpeg`),
      Array.from({length: 50}, (_, i) => `photo${i + 1}.png`),
      Array.from({length: 50}, (_, i) => `photo${i + 1}.webp`),
      // IMG連番パターン
      Array.from({length: 50}, (_, i) => `IMG_${String(i + 1).padStart(4, '0')}.jpg`),
      Array.from({length: 50}, (_, i) => `IMG_${String(i + 1).padStart(4, '0')}.jpeg`),
    ].flat();
    
    // 画像の存在を並列チェック（最初の10個まで）
    const checkPromises = patterns.slice(0, 50).map(async (filename) => {
      try {
        const response = await fetch(categoryPath + filename, { method: 'HEAD' });
        if (response.ok) {
          return filename;
        }
      } catch (error) {
        return null;
      }
      return null;
    });
    
    const results = await Promise.all(checkPromises);
    return results.filter(Boolean);
  }

  // 写真ギャラリーの動的生成（ディレクトリベース）
  async function initPhotoGallery() {
    if (typeof photoCategoryNames === 'undefined') {
      console.warn('photoCategoryNames が読み込まれていません');
      return;
    }

    const categoriesContainer = document.getElementById('photoCategories');
    const galleryContainer = document.getElementById('photoGallery');
    
    if (!categoriesContainer || !galleryContainer) return;

    let allPhotos = [];
    const categories = Object.keys(photoCategoryNames);

    // ローディング表示
    galleryContainer.innerHTML = '<p style="text-align: center; color: var(--color-text-light); grid-column: 1/-1;">📷 写真を読み込んでいます...</p>';

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

      galleryContainer.innerHTML = photosToDisplay.map((photo, index) => `
        <div class="photo-item reveal-on-scroll" data-index="${index}" data-category="${photo.category}">
          <div class="photo-image-wrapper">
            <img src="${placeholder}" data-src="${photo.src}" alt="${photo.alt}" class="gallery-image lazy-image">
            <div class="photo-overlay">
              <span class="photo-icon">🔍</span>
            </div>
          </div>
        </div>
      `).join('');

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
    displayPhotos('all');
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
    photoSources = photos.map(photo => ({
      src: photo.src,
      alt: photo.alt
    }));

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
