const CACHE_NAME = 'rendimientos-io-v1';
const ASSETS = [
  './rendimientos_obra_IO_10_6.html',
  './manifest.json',
  './icon.svg'
];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(function (cache) { return cache.addAll(ASSETS); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(self.clients.claim());
});

/* Red primero (para traer siempre lo último), y si no hay conexión,
   sirve la última copia guardada en cache. */
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(function (res) {
        var resClone = res.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(e.request, resClone); });
        return res;
      })
      .catch(function () { return caches.match(e.request); })
  );
});
