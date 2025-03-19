const CACHE_NAME = 'currency-converter-v1';
const urlsToCache = ['/', '/index.html', '/icons/icon-192x192.png', '/icons/icon-512x512.png'];

// self 타입 명시 (Vite + TypeScript에서 정상 처리)
declare const self: ServiceWorkerGlobalScope;

// 설치 이벤트
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache: Cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// fetch 이벤트
self.addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// 활성화 이벤트
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});