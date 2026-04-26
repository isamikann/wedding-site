const CACHE_NAME = "wedding-cache";
const ASSETS_TO_PRECACHE = [
    "/",
    "/index.html",
    "/css/style.css",
    "/js/main.js",
    "/images-config.js",
    "/photos-config.js",
    "/img/main/main_visual.jpg",
    "/img/welcome/welcome.jpg",
    "/img/index/seating.jpg",
    "/img/index/menu.jpg",
    "/img/index/profile.jpg",
    "/img/index/qa.jpg",
    "/img/index/story.jpg",
    "/img/index/food.jpg",
    "/img/index/favorites.jpg",
    "/img/index/photos.jpg",
    "/img/profile/groom.jpg",
    "/img/profile/bride.jpg",
    "/img/seating/seating.jpg",
    "/img/menu/menu-combined.jpg",
    "/img/favicon.svg",
];

// インストール時にプリキャッシュ（オフライン用の保険）
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS_TO_PRECACHE)),
    );
    // 待機中の古い SW を即座に置き換える
    self.skipWaiting();
});

// 起動時に古いキャッシュ名があれば掃除（互換用）
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((names) =>
                Promise.all(
                    names
                        .filter((n) => n !== CACHE_NAME)
                        .map((n) => caches.delete(n)),
                ),
            ),
    );
    self.clients.claim();
});

// ────────────────────────────────────────
// fetch 戦略: すべてネットワーク優先
//   成功 → レスポンスをキャッシュに保存して返す
//   失敗 → キャッシュから返す（オフラインフォールバック）
// ────────────────────────────────────────
self.addEventListener("fetch", (event) => {
    // GET 以外は何もしない
    if (event.request.method !== "GET") return;

    event.respondWith(
        (async () => {
            const cache = await caches.open(CACHE_NAME);

            try {
                const response = await fetch(event.request);

                // 正常レスポンスならキャッシュを更新
                if (response.ok) {
                    // 画像の場合は content-type を検証してからキャッシュ
                    if (event.request.destination === "image") {
                        const ct = response.headers.get("content-type") || "";
                        if (ct.startsWith("image/")) {
                            cache.put(event.request, response.clone());
                        }
                    } else {
                        cache.put(event.request, response.clone());
                    }
                }

                return response;
            } catch {
                // ネットワーク失敗 → キャッシュにあれば返す
                const cached = await cache.match(event.request);
                if (cached) return cached;

                // キャッシュもなければエラー
                return Response.error();
            }
        })(),
    );
});
