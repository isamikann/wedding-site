document.addEventListener("DOMContentLoaded", () => {
    // 画像パスの自動設定
    function initImagePaths() {
        if (
            typeof imageConfig === "undefined" ||
            typeof getImagePath !== "function"
        ) {
            return;
        }

        // data-image-key 属性を持つ画像要素を処理
        document
            .querySelectorAll("img[data-image-key]")
            .forEach(async (img) => {
                const imageKey = img.dataset.imageKey;
                try {
                    const imagePath = getImagePath(imageKey);

                    if (imagePath && imagePath !== img.src) {
                        img.src = imagePath;
                    }
                } catch (error) {
                    // silently ignore
                }
            });
    }

    // 画像パス初期化を実行（エラーでも続行）
    try {
        initImagePaths();
    } catch (error) {
        // silently ignore
    }

    // ローディング画面の非表示
    window.addEventListener("load", () => {
        const loadingScreen = document.getElementById("loading-screen");
        if (loadingScreen) {
            loadingScreen.classList.add("hidden");
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }
    });

    // 画像の遅延読み込みとローディング表示
    document.querySelectorAll("img").forEach((img) => {
        // 画像読み込みエラー時のフォールバック
        img.addEventListener("error", function () {
            // プロフィール画像の場合
            if (this.classList.contains("profile-image")) {
                this.src = "img/profile_placeholder.svg";
            }
            // その他の画像の場合
            else if (!this.src.includes("placeholder.svg")) {
                this.src = "img/placeholder.svg";
            }
        });

        if (img.complete) {
            img.classList.add("loaded");
        } else {
            img.addEventListener("load", () => {
                img.classList.add("loaded");
            });
        }
    });
    // ナビゲーションの開閉
    const navToggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".site-nav");

    // モバイルナビの開閉状態を同期
    function setNavExpanded(isExpanded) {
        if (!navToggle || !nav) return;
        nav.classList.toggle("is-open", isExpanded);
        navToggle.setAttribute("aria-expanded", String(isExpanded));
    }

    navToggle?.addEventListener("click", () => {
        const willExpand = !nav?.classList.contains("is-open");
        setNavExpanded(willExpand);
    });

    // オーバーレイ背景タップでナビを閉じる
    document.addEventListener("click", (e) => {
        if (
            nav?.classList.contains("is-open") &&
            !nav.contains(e.target) &&
            !navToggle?.contains(e.target)
        ) {
            setNavExpanded(false);
        }
    });

    // 席次表画像タップでライトボックス表示（シンプルモード）
    const seatingImg = document.getElementById("seatingImg");
    if (seatingImg) {
        seatingImg.addEventListener("click", () => {
            const lightbox = document.getElementById("lightbox");
            const lightboxImg = document.getElementById("lightboxImg");
            if (lightbox && lightboxImg) {
                lightboxImg.src = seatingImg.src;
                lightboxImg.alt = seatingImg.alt;
                lightbox.classList.add("active", "simple");
                document.body.style.overflow = "hidden";
            }
        });
    }

    if (seatingImg) {
        seatingImg.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                seatingImg.click();
            }
        });
    }

    // メニュー画像タップでライトボックス表示（シンプルモード）
    document.querySelectorAll("#menuFoodImg, #menuDrinkImg").forEach((img) => {
        img.addEventListener("click", () => {
            const lightbox = document.getElementById("lightbox");
            const lightboxImg = document.getElementById("lightboxImg");
            if (lightbox && lightboxImg) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add("active", "simple");
                document.body.style.overflow = "hidden";
            }
        });
    });

    document.querySelectorAll("#menuFoodImg, #menuDrinkImg").forEach((img) => {
        img.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                img.click();
            }
        });
    });

    // スクロールアニメーション
    const revealElements = document.querySelectorAll(".reveal-on-scroll");
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                }
            });
        },
        {
            threshold: 0.15,
        },
    );

    revealElements.forEach((el) => observer.observe(el));

    // =========================================
    // ページルーティングシステム
    // =========================================
    const PAGE_SECTIONS = [
        "seating",
        "menu",
        "profile",
        "qa",
        "story",
        "local-food",
        "favorites",
        "photos",
    ];

    function navigateTo(pageId, pushState = true) {
        const isHome = !pageId || !PAGE_SECTIONS.includes(pageId);

        if (isHome) {
            const activeSection = document.querySelector(
                ".page-section.is-page-active",
            );
            if (activeSection) {
                activeSection.classList.add("is-page-exiting");
                activeSection.addEventListener(
                    "animationend",
                    () => {
                        activeSection.classList.remove(
                            "is-page-active",
                            "is-page-exiting",
                        );
                        document.body.classList.remove("is-section-page");
                    },
                    { once: true },
                );
            } else {
                document.body.classList.remove("is-section-page");
            }
            if (pushState)
                history.pushState(
                    { page: "home" },
                    "",
                    location.pathname + location.search,
                );
            window.scrollTo({ top: 0 });
        } else {
            const currentActive = document.querySelector(
                ".page-section.is-page-active",
            );
            const target = document.getElementById(pageId);

            const showTarget = () => {
                document.body.classList.add("is-section-page");
                document
                    .querySelectorAll(".page-section")
                    .forEach((el) =>
                        el.classList.remove(
                            "is-page-active",
                            "is-page-exiting",
                        ),
                    );
                if (target) {
                    target.classList.add("is-page-active");
                    target
                        .querySelectorAll(".reveal-on-scroll")
                        .forEach((el) => {
                            el.classList.remove("is-visible");
                            observer.observe(el);
                        });
                }
                if (pushState)
                    history.pushState({ page: pageId }, "", "#" + pageId);
                window.scrollTo({ top: 0 });

                document.querySelectorAll(".nav-item").forEach((item) => {
                    item.classList.toggle(
                        "active",
                        item.getAttribute("href") === "#" + pageId,
                    );
                });
            };

            if (currentActive && currentActive.id !== pageId) {
                currentActive.classList.add("is-page-exiting");
                currentActive.addEventListener(
                    "animationend",
                    () => {
                        currentActive.classList.remove(
                            "is-page-active",
                            "is-page-exiting",
                        );
                        showTarget();
                    },
                    { once: true },
                );
            } else {
                showTarget();
            }
        }
    }

    // ブラウザの戻る・進む対応
    window.addEventListener("popstate", () => {
        const hash = location.hash.replace("#", "");
        navigateTo(hash || "home", false);
    });

    // 初期ロード：URLにハッシュがあれば対応するページを表示
    const initialHash = location.hash.replace("#", "");
    if (initialHash && PAGE_SECTIONS.includes(initialHash)) {
        navigateTo(initialHash, false);
    }

    // リンククリックのハンドリング（ルーティング統合版）
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href").replace("#", "");

            if (PAGE_SECTIONS.includes(targetId)) {
                // セクションページへ遷移
                navigateTo(targetId);
            } else {
                // ホーム内スクロール
                if (document.body.classList.contains("is-section-page")) {
                    navigateTo("home", true);
                    setTimeout(() => {
                        const el = document.getElementById(targetId);
                        if (!el) return;
                        const headerHeight =
                            document.querySelector(".site-header")
                                ?.offsetHeight || 0;
                        window.scrollTo({
                            top:
                                el.getBoundingClientRect().top +
                                window.scrollY -
                                headerHeight,
                            behavior: "smooth",
                        });
                    }, 100);
                } else {
                    const el = document.getElementById(targetId);
                    if (el) {
                        const headerHeight =
                            document.querySelector(".site-header")
                                ?.offsetHeight || 0;
                        window.scrollTo({
                            top:
                                el.getBoundingClientRect().top +
                                window.scrollY -
                                headerHeight,
                            behavior: "smooth",
                        });
                    }
                }
            }
            setNavExpanded(false);
        });
    });

    // サイトタイトルクリックでホームへ戻る
    const siteTitle = document.querySelector(".site-title");
    if (siteTitle) {
        siteTitle.style.cursor = "pointer";
        siteTitle.addEventListener("click", () => navigateTo("home"));
    }

    // 戻るボタン
    document
        .getElementById("page-back-btn")
        ?.addEventListener("click", () => navigateTo("home"));

    // セクションページ間のスワイプナビゲーション
    let sectionSwipeStartX = 0;
    let sectionSwipeStartY = 0;

    document.addEventListener(
        "touchstart",
        (e) => {
            if (!document.body.classList.contains("is-section-page")) return;
            sectionSwipeStartX = e.touches[0].clientX;
            sectionSwipeStartY = e.touches[0].clientY;
        },
        { passive: true },
    );

    document.addEventListener(
        "touchend",
        (e) => {
            if (!document.body.classList.contains("is-section-page")) return;
            // ライトボックスが開いている場合はスキップ
            const lb = document.getElementById("lightbox");
            if (lb && lb.classList.contains("active")) return;

            const diffX = e.changedTouches[0].clientX - sectionSwipeStartX;
            const diffY = e.changedTouches[0].clientY - sectionSwipeStartY;
            const minSwipe = 80;

            // 横スワイプが縦より大きく、最小距離を超えた場合のみ
            if (
                Math.abs(diffX) > Math.abs(diffY) &&
                Math.abs(diffX) > minSwipe
            ) {
                const currentPage = document.querySelector(
                    ".page-section.is-page-active",
                );
                if (!currentPage) return;
                const currentId = currentPage.id;
                const currentIndex = PAGE_SECTIONS.indexOf(currentId);
                if (currentIndex === -1) return;

                if (diffX < 0 && currentIndex < PAGE_SECTIONS.length - 1) {
                    // 左スワイプ = 次のセクション
                    navigateTo(PAGE_SECTIONS[currentIndex + 1]);
                } else if (diffX > 0 && currentIndex > 0) {
                    // 右スワイプ = 前のセクション
                    navigateTo(PAGE_SECTIONS[currentIndex - 1]);
                }
            }
        },
        { passive: true },
    );

    // アクティブセクションの検出とパララックス効果
    const sections = document.querySelectorAll("section[id]");
    const navItems = document.querySelectorAll(".nav-item");
    const heroImage = document.querySelector(".hero-image");
    const pageTopButton = createPageTopButton();
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches;

    // スクロールイベントのスロットリング
    let ticking = false;
    window.addEventListener(
        "scroll",
        () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        },
        { passive: true },
    );

    function handleScroll() {
        const scrollY = window.scrollY;

        // スクロールプログレスバー
        const scrollProgress = document.getElementById("scroll-progress");
        if (scrollProgress) {
            const docHeight =
                document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent =
                docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
            scrollProgress.style.width = scrollPercent + "%";
        }

        // パララックス効果（ヒーロー画像）- モーション設定尊重
        if (
            !prefersReducedMotion &&
            heroImage &&
            scrollY < window.innerHeight
        ) {
            heroImage.style.transform = `translateY(${scrollY * 0.3}px) scale(1.1)`;
        }

        // ページトップボタンの表示/非表示
        if (scrollY > 300) {
            pageTopButton.classList.add("visible");
        } else {
            pageTopButton.classList.remove("visible");
        }

        // アクティブセクションの検出
        let current = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute("id");
            }
        });

        navItems.forEach((item) => {
            item.classList.remove("active");
            if (item.getAttribute("href").slice(1) === current) {
                item.classList.add("active");
            }
        });
    }

    // ページトップボタンの作成
    function createPageTopButton() {
        const button = document.createElement("button");
        button.className = "page-top";
        button.setAttribute("aria-label", "ページトップへ戻る");
        button.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        });
        document.body.appendChild(button);
        return button;
    }

    // 画像URLを最適化する関数
    function optimizeImageUrl(originalUrl) {
        // 最適化が無効の場合は元のURLを返す
        if (
            typeof imageOptimizationConfig === "undefined" ||
            !imageOptimizationConfig.enabled
        ) {
            return originalUrl;
        }

        // デバイスの画面幅を取得
        const screenWidth = window.innerWidth * (window.devicePixelRatio || 1);

        // 最適なサイズを決定
        let targetWidth = imageOptimizationConfig.maxWidth;
        if (screenWidth <= 768) {
            targetWidth = Math.min(
                imageOptimizationConfig.responsiveSizes.mobile,
                screenWidth,
            );
        } else if (screenWidth <= 1024) {
            targetWidth = Math.min(
                imageOptimizationConfig.responsiveSizes.tablet,
                screenWidth,
            );
        } else {
            targetWidth = Math.min(
                imageOptimizationConfig.responsiveSizes.desktop,
                screenWidth,
            );
        }

        // Cloudflare Image Resizingを使用
        if (imageOptimizationConfig.useCloudflare) {
            // Cloudflare Image Resizing形式
            // /cdn-cgi/image/width=800,quality=85,format=auto/img/photos/...
            const format = imageOptimizationConfig.preferWebP ? "auto" : "jpeg";
            return `/cdn-cgi/image/width=${targetWidth},quality=${imageOptimizationConfig.quality},format=${format}/${originalUrl}`;
        }

        // フォールバック: ブラウザ側で制限（CSSで対応）
        return originalUrl;
    }

    // ディレクトリから画像を自動検出する関数
    async function detectImagesInDirectory(categoryKey) {
        const categoryPath = photoBasePath + categoryKey + "/";
        const detectedImages = [];
        const extensions =
            typeof supportedImageExtensions !== "undefined"
                ? supportedImageExtensions
                : [".jpg", ".jpeg", ".png", ".webp", ".gif"];

        // まず manifest.json があれば、そのファイル名一覧を優先する
        try {
            const manifestResponse = await fetch(
                categoryPath + "manifest.json",
                { cache: "no-store" },
            );
            if (manifestResponse.ok) {
                const manifest = await manifestResponse.json();
                const candidateItems = Array.isArray(manifest)
                    ? manifest
                    : Array.isArray(manifest?.images)
                      ? manifest.images
                      : [];

                candidateItems.forEach((item, index) => {
                    const filename =
                        typeof item === "string"
                            ? item.trim()
                            : (item?.file || item?.src || "").trim();
                    if (
                        !filename ||
                        !extensions.some((ext) =>
                            filename.toLowerCase().endsWith(ext),
                        )
                    ) {
                        return;
                    }

                    const label =
                        typeof item === "object" && item !== null
                            ? item.alt || item.title || item.label || ""
                            : "";

                    detectedImages.push({
                        filename,
                        alt:
                            label ||
                            `${photoCategoryNames[categoryKey]} ${index + 1}`,
                    });
                });

                if (detectedImages.length > 0) {
                    return detectedImages;
                }
            }
        } catch (error) {
            // silently ignore
        }

        // manifest がない場合は従来の連番探索にフォールバック
        const legacyExtensions = ["jpg", "jpeg", "png", "webp"];
        let index = 1;
        const maxIndex = 30;

        while (index <= maxIndex) {
            let foundThisIndex = false;

            for (const ext of legacyExtensions) {
                const filename = `photo${index}.${ext}`;
                const url = categoryPath + filename;

                try {
                    const response = await fetch(url, {
                        method: "HEAD",
                        cache: "no-store",
                    });
                    const contentType =
                        response.headers.get("content-type") || "";
                    const isImage =
                        contentType === "" || contentType.startsWith("image/");

                    if (response.ok && isImage) {
                        detectedImages.push({
                            filename,
                            alt: `${photoCategoryNames[categoryKey]} ${index}`,
                        });
                        foundThisIndex = true;
                        break;
                    }
                } catch (error) {
                    // 無視（次の拡張子を試す）
                }
            }

            if (!foundThisIndex) {
                break;
            }

            index++;
        }

        return detectedImages;
    }

    // 写真ギャラリーの動的生成（ディレクトリベース）
    async function initPhotoGallery() {
        if (typeof photoCategoryNames === "undefined") {
            return;
        }

        const categoriesContainer = document.getElementById("photoCategories");
        const galleryContainer = document.getElementById("photoGallery");

        if (!categoriesContainer || !galleryContainer) {
            return;
        }

        let allPhotos = [];
        const categories = Object.keys(photoCategoryNames);

        // ローディング表示
        galleryContainer.innerHTML =
            '<p style="text-align: center; color: var(--color-text-light); grid-column: 1/-1;">📷 写真を読み込んでいます...</p>';

        try {
            // 各カテゴリーのディレクトリから画像を自動検出
            for (const categoryKey of categories) {
                try {
                    const files = await detectImagesInDirectory(categoryKey);

                    const categoryPath = photoBasePath + categoryKey + "/";

                    files.forEach((photo, index) => {
                        allPhotos.push({
                            category: categoryKey,
                            src: categoryPath + photo.filename,
                            alt:
                                photo.alt ||
                                `${photoCategoryNames[categoryKey]} ${index + 1}`,
                            categoryTitle: photoCategoryNames[categoryKey],
                        });
                    });
                } catch (error) {
                    // silently ignore
                }
            }
        } catch (error) {
            galleryContainer.innerHTML =
                '<p style="text-align: center; color: red; grid-column: 1/-1;">⚠️ 写真の読み込みに失敗しました</p>';
            return;
        }

        // カテゴリータブを作成（写真が存在するカテゴリーのみ）
        const availableCategories = [
            ...new Set(allPhotos.map((p) => p.category)),
        ];
        const categoryTabsHTML = `
      <button class="category-tab active" data-category="all">すべて</button>
      ${availableCategories
          .map((categoryKey) => {
              return `<button class="category-tab" data-category="${categoryKey}">${photoCategoryNames[categoryKey]}</button>`;
          })
          .join("")}
    `;
        categoriesContainer.innerHTML = categoryTabsHTML;

        // 写真を表示する関数
        let carouselCurrentIndex = 0;

        function displayPhotos(categoryFilter = "all") {
            const photosToDisplay =
                categoryFilter === "all"
                    ? allPhotos
                    : allPhotos.filter(
                          (photo) => photo.category === categoryFilter,
                      );

            if (photosToDisplay.length === 0) {
                galleryContainer.innerHTML =
                    '<p style="text-align: center; color: var(--color-text-light);">写真がまだ追加されていません</p>';
                return;
            }

            carouselCurrentIndex = 0;

            // カルーセルHTMLを生成（ダブルバッファ構成: front/backの2枚重ね）
            galleryContainer.innerHTML = `
        <div class="photo-carousel">
          <div class="carousel-main" id="carouselMain">
            <button class="carousel-btn carousel-prev-btn" aria-label="前の写真">&#10094;</button>
            <div class="carousel-main-frame">
              <img id="carouselImgFront"
                src="${optimizeImageUrl(photosToDisplay[0].src)}"
                alt="${photosToDisplay[0].alt}"
                class="carousel-main-img carousel-buf-front">
              <img id="carouselImgBack"
                src=""
                alt=""
                class="carousel-main-img carousel-buf-back">
            </div>
            <button class="carousel-btn carousel-next-btn" aria-label="次の写真">&#10095;</button>
            <div class="carousel-counter-badge" id="carouselCounter">1 / ${photosToDisplay.length}</div>
            <div class="carousel-caption" id="carouselCaption">${photosToDisplay[0].categoryTitle}</div>
            <div class="carousel-expand-hint">クリックで拡大 🔍</div>
          </div>
          <div class="carousel-thumbnails-wrap">
            <div class="carousel-thumbnails" id="carouselThumbnails">
              ${photosToDisplay
                  .map(
                      (photo, i) => `
                <img
                  src="${optimizeImageUrl(photo.src)}"
                  alt="${photo.alt}"
                  class="carousel-thumb${i === 0 ? " active" : ""}"
                  data-index="${i}"
                  loading="lazy"
                >
              `,
                  )
                  .join("")}
            </div>
          </div>
        </div>
      `;

            // ダブルバッファによるカルーセル更新
            // front = 現在表示中, back = 裏で先読み中
            // 新画像をbackで完全ロードしてからfrontと入れ替えることで空白フレームをゼロにする
            let pendingIndex = null; // 最新のリクエストだけを処理するために使用

            function updateCarousel(index) {
                carouselCurrentIndex =
                    (index + photosToDisplay.length) % photosToDisplay.length;
                pendingIndex = carouselCurrentIndex;

                const imgFront = document.getElementById("carouselImgFront");
                const imgBack = document.getElementById("carouselImgBack");
                const counter = document.getElementById("carouselCounter");
                const caption = document.getElementById("carouselCaption");
                const thumbs = document.querySelectorAll(".carousel-thumb");

                const targetIndex = carouselCurrentIndex;
                const targetSrc = optimizeImageUrl(
                    photosToDisplay[targetIndex].src,
                );
                const targetAlt = photosToDisplay[targetIndex].alt;

                // UI（カウンター・キャプション・サムネイル）は即時更新
                counter.textContent = `${targetIndex + 1} / ${photosToDisplay.length}`;
                caption.textContent =
                    photosToDisplay[targetIndex].categoryTitle;
                thumbs.forEach((thumb, i) => {
                    thumb.classList.toggle("active", i === targetIndex);
                });
                const activeThumb = document.querySelector(
                    ".carousel-thumb.active",
                );
                if (activeThumb) {
                    activeThumb.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                        inline: "center",
                    });
                }

                // 同じ画像なら何もしない
                if (
                    imgFront.src === targetSrc ||
                    (imgFront.src.endsWith(targetSrc) &&
                        !targetSrc.startsWith("/"))
                ) {
                    return;
                }

                // backバッファで新画像を先読み
                imgBack.alt = targetAlt;
                imgBack.src = targetSrc;

                const swap = () => {
                    // より新しいリクエストがあれば古いswapはスキップ
                    if (pendingIndex !== targetIndex) return;

                    // frontとbackをCSS上でスワップ（z-indexで切り替え）
                    imgFront.src = targetSrc;
                    imgFront.alt = targetAlt;

                    // backをリセット（次回のために空にする）
                    imgBack.src = "";
                    imgBack.alt = "";
                };

                if (imgBack.complete && imgBack.naturalWidth > 0) {
                    swap();
                } else {
                    imgBack.addEventListener("load", swap, { once: true });
                    imgBack.addEventListener(
                        "error",
                        () => {
                            if (pendingIndex !== targetIndex) return;
                            imgFront.alt = targetAlt + " (読み込みエラー)";
                            imgBack.src = "";
                            imgBack.alt = "";
                        },
                        { once: true },
                    );
                }
            }

            // 前/次ボタン
            galleryContainer
                .querySelector(".carousel-prev-btn")
                .addEventListener("click", (e) => {
                    e.stopPropagation();
                    updateCarousel(carouselCurrentIndex - 1);
                });
            galleryContainer
                .querySelector(".carousel-next-btn")
                .addEventListener("click", (e) => {
                    e.stopPropagation();
                    updateCarousel(carouselCurrentIndex + 1);
                });

            // サムネイルクリック
            document
                .getElementById("carouselThumbnails")
                .addEventListener("click", (e) => {
                    const thumb = e.target.closest(".carousel-thumb");
                    if (thumb) {
                        updateCarousel(parseInt(thumb.dataset.index));
                    }
                });

            // スワイプ操作（モバイル）
            let swipeStartX = 0;
            const mainFrame = galleryContainer.querySelector(
                ".carousel-main-frame",
            );
            mainFrame.addEventListener(
                "touchstart",
                (e) => {
                    swipeStartX = e.touches[0].clientX;
                },
                { passive: true },
            );
            mainFrame.addEventListener(
                "touchend",
                (e) => {
                    const diff = swipeStartX - e.changedTouches[0].clientX;
                    if (Math.abs(diff) > 50) {
                        updateCarousel(
                            carouselCurrentIndex + (diff > 0 ? 1 : -1),
                        );
                    }
                },
                { passive: true },
            );

            // キーボード操作（ライトボックスが閉じているとき）
            galleryContainer._carouselKeyHandler &&
                document.removeEventListener(
                    "keydown",
                    galleryContainer._carouselKeyHandler,
                );
            galleryContainer._carouselKeyHandler = (e) => {
                if (lightbox && lightbox.classList.contains("active")) return;
                if (e.key === "ArrowRight")
                    updateCarousel(carouselCurrentIndex + 1);
                if (e.key === "ArrowLeft")
                    updateCarousel(carouselCurrentIndex - 1);
            };
            document.addEventListener(
                "keydown",
                galleryContainer._carouselKeyHandler,
            );

            // メイン画像クリック → ライトボックスで拡大表示
            document
                .getElementById("carouselMain")
                .addEventListener("click", (e) => {
                    if (
                        !e.target.classList.contains("carousel-btn") &&
                        !e.target.closest(".carousel-btn")
                    ) {
                        currentPhotoIndex = carouselCurrentIndex;
                        slideDirection = null; // 最初のクリックはズームイン
                        showLightbox();
                    }
                });

            // ライトボックス用に photoSources を初期化
            initLightbox(photosToDisplay);
        }

        // カテゴリータブのクリックイベント
        categoriesContainer.addEventListener("click", (e) => {
            if (e.target.classList.contains("category-tab")) {
                // アクティブなタブを切り替え
                categoriesContainer
                    .querySelectorAll(".category-tab")
                    .forEach((tab) => {
                        tab.classList.remove("active");
                    });
                e.target.classList.add("active");

                // カテゴリーで写真をフィルタリング
                const category = e.target.dataset.category;
                displayPhotos(category);
            }
        });

        // 初期表示
        if (allPhotos.length === 0) {
            galleryContainer.innerHTML =
                '<p style="text-align: center; color: var(--color-text-light); grid-column: 1/-1;">📷 写真がまだ追加されていません。<br>img/photos/ フォルダに画像を追加してください。</p>';
        } else {
            displayPhotos("all");
        }
    }

    // フォトギャラリー - ライトボックス機能
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxClose = document.querySelector(".lightbox-close");
    const lightboxPrev = document.querySelector(".lightbox-prev");
    const lightboxNext = document.querySelector(".lightbox-next");

    let currentPhotoIndex = 0;
    let photoSources = [];
    let slideDirection = null;
    let lastFocusedElement = null;

    function initLightbox(photos) {
        photoSources = photos.map((photo) => {
            const optimizedSrc = optimizeImageUrl(photo.src);
            return {
                src: optimizedSrc,
                alt: photo.alt,
            };
        });
    }

    let focusTrapHandler = null;
    function setupFocusTrap() {
        if (focusTrapHandler) {
            document.removeEventListener("keydown", focusTrapHandler);
        }
        const focusableElements = lightbox.querySelectorAll(
            "button:not([disabled])",
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        focusTrapHandler = (e) => {
            if (e.key !== "Tab" || !lightbox.classList.contains("active"))
                return;
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        };
        document.addEventListener("keydown", focusTrapHandler);
    }

    function showLightbox() {
        if (photoSources[currentPhotoIndex]) {
            // アニメーションクラスをリセット
            lightboxImg.classList.remove("slide-left", "slide-right");

            // カウンター更新
            const counter = document.getElementById("lightboxCounter");
            if (counter && !lightbox.classList.contains("simple")) {
                counter.textContent = `${currentPhotoIndex + 1} / ${photoSources.length}`;
                counter.style.display = "";
            } else if (counter) {
                counter.style.display = "none";
            }

            // 少し待ってから新しい画像を設定（スムーズな切り替えのため）
            setTimeout(
                () => {
                    lightboxImg.src = photoSources[currentPhotoIndex].src;
                    lightboxImg.alt = photoSources[currentPhotoIndex].alt;

                    // スライド方向に応じてクラスを追加
                    if (slideDirection === "next") {
                        lightboxImg.classList.add("slide-left");
                    } else if (slideDirection === "prev") {
                        lightboxImg.classList.add("slide-right");
                    }

                    lightbox.classList.add("active");
                    document.body.style.overflow = "hidden";

                    // アクセシビリティ: 閉じるボタンにフォーカス
                    if (lightboxClose) {
                        lightboxClose.focus();
                        setupFocusTrap();
                    }
                },
                slideDirection ? 50 : 0,
            );
        }
    }

    function closeLightbox() {
        if (focusTrapHandler) {
            document.removeEventListener("keydown", focusTrapHandler);
            focusTrapHandler = null;
        }
        lightbox.classList.remove("active", "simple");
        document.body.style.overflow = "";
        // フォーカスを元に戻す
        if (lastFocusedElement) {
            lastFocusedElement.focus();
            lastFocusedElement = null;
        }
    }

    function showNextPhoto() {
        currentPhotoIndex = (currentPhotoIndex + 1) % photoSources.length;
        slideDirection = "next";
        showLightbox();
    }

    function showPrevPhoto() {
        currentPhotoIndex =
            (currentPhotoIndex - 1 + photoSources.length) % photoSources.length;
        slideDirection = "prev";
        showLightbox();
    }

    // 写真ギャラリーを初期化
    initPhotoGallery();

    if (lightboxClose) {
        lightboxClose.addEventListener("click", closeLightbox);
    }

    if (lightboxNext) {
        lightboxNext.addEventListener("click", showNextPhoto);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener("click", showPrevPhoto);
    }

    // ライトボックス背景クリックで閉じる
    if (lightbox) {
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // キーボード操作
    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("active")) return;

        if (e.key === "Escape") {
            closeLightbox();
        } else if (!lightbox.classList.contains("simple")) {
            if (e.key === "ArrowRight") {
                showNextPhoto();
            } else if (e.key === "ArrowLeft") {
                showPrevPhoto();
            }
        }
    });

    // タッチ/スワイプ操作
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    if (lightbox) {
        lightbox.addEventListener(
            "touchstart",
            (e) => {
                touchStartX = e.changedTouches[0].screenX;
                touchStartY = e.changedTouches[0].screenY;
            },
            { passive: true },
        );

        lightbox.addEventListener(
            "touchend",
            (e) => {
                if (!lightbox.classList.contains("active")) return;

                touchEndX = e.changedTouches[0].screenX;
                touchEndY = e.changedTouches[0].screenY;
                handleSwipe();
            },
            { passive: true },
        );
    }

    function handleSwipe() {
        if (lightbox.classList.contains("simple")) return;
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        const minSwipeDistance = 50;

        // 横スワイプが縦スワイプより大きい場合のみ反応
        if (
            Math.abs(diffX) > Math.abs(diffY) &&
            Math.abs(diffX) > minSwipeDistance
        ) {
            if (diffX > 0) {
                // 右にスワイプ = 前の画像
                showPrevPhoto();
            } else {
                // 左にスワイプ = 次の画像
                showNextPhoto();
            }
        }
    }

    // Service Worker登録
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("/sw.js").catch(() => {});
        });
    }
});
