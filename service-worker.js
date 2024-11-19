const CACHE_NAME = 'athlete-record-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/script.js',
    '/styles.css',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// インストール時にキャッシュをセットアップ
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

// フェッチ時にキャッシュからリソースを取得
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;  // キャッシュがあればそれを返す
                }
                return fetch(event.request);  // なければネットワークから取得
            })
    );
});

// サービスワーカーのアクティベート時に古いキャッシュを削除
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

