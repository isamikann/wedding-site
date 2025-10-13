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

  // 浮遊するハートの装飾
  function createFloatingHearts() {
    const heartsContainer = document.createElement('div');
    heartsContainer.className = 'decorative-hearts';
    document.body.appendChild(heartsContainer);
    
    function addHeart() {
      const heart = document.createElement('div');
      heart.className = 'heart';
      heart.innerHTML = '💕';
      heart.style.left = Math.random() * 100 + '%';
      heart.style.animationDelay = Math.random() * 5 + 's';
      heart.style.fontSize = (Math.random() * 10 + 15) + 'px';
      heartsContainer.appendChild(heart);
      
      // 15秒後に削除
      setTimeout(() => {
        heart.remove();
      }, 15000);
    }
    
    // 初期配置
    for (let i = 0; i < 5; i++) {
      setTimeout(addHeart, i * 3000);
    }
    
    // 定期的に追加
    setInterval(addHeart, 8000);
  }
  
  // ハートエフェクトを起動（控えめに）
  createFloatingHearts();

  // フォトギャラリー - ライトボックス機能
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  const photoItems = document.querySelectorAll('.photo-item');
  
  let currentPhotoIndex = 0;
  const photoSources = Array.from(photoItems).map(item => {
    const img = item.querySelector('.gallery-image');
    return {
      src: img.src,
      alt: img.alt
    };
  });

  photoItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentPhotoIndex = index;
      showLightbox();
    });
  });

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
