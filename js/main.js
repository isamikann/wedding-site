document.addEventListener('DOMContentLoaded', () => {
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

  // 写真ギャラリーの動的生成
  function initPhotoGallery() {
    if (typeof photoConfig === 'undefined') {
      console.error('photoConfig が読み込まれていません');
      return;
    }

    const categoriesContainer = document.getElementById('photoCategories');
    const galleryContainer = document.getElementById('photoGallery');
    
    if (!categoriesContainer || !galleryContainer) return;

    let allPhotos = [];
    const categories = Object.keys(photoConfig);
    let activeCategory = 'all';

    // カテゴリータブを作成
    const categoryTabsHTML = `
      <button class="category-tab active" data-category="all">すべて</button>
      ${categories.map(categoryKey => {
        const category = photoConfig[categoryKey];
        return `<button class="category-tab" data-category="${categoryKey}">${category.title}</button>`;
      }).join('')}
    `;
    categoriesContainer.innerHTML = categoryTabsHTML;

    // すべての写真を収集
    categories.forEach(categoryKey => {
      const category = photoConfig[categoryKey];
      category.photos.forEach(photo => {
        allPhotos.push({
          category: categoryKey,
          src: photoBasePath + photo.filename,
          alt: photo.alt || photo.filename,
          categoryTitle: category.title
        });
      });
    });

    // 写真を表示する関数
    function displayPhotos(categoryFilter = 'all') {
      const photosToDisplay = categoryFilter === 'all' 
        ? allPhotos 
        : allPhotos.filter(photo => photo.category === categoryFilter);

      galleryContainer.innerHTML = photosToDisplay.map((photo, index) => `
        <div class="photo-item reveal-on-scroll" data-index="${index}" data-category="${photo.category}">
          <img src="${photo.src}" alt="${photo.alt}" class="gallery-image">
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
