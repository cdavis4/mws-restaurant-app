/**
 * cache names
 */
var staticCacheName = 'restaurant-review-static';
var contentImgsCache = 'restaurant-review-imgs';
var allCaches = [
    staticCacheName,
    contentImgsCache
];

//install service worker
self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(staticCacheName).then(function(cache) {
        return cache.addAll([
          '/',
          '/css/styles.css',
          '/css/responsive.css',
          '/index.html',
          '/restaurant.html',
          '/data/restaurants.json',
          '/js/main.js',
          '/js/restaurant_info.js',
          '/registerSW.js',
          '/sw.js',
          '/js/dbhelper.js',
          'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
          'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
          'https://unpkg.com/leaflet@1.3.1/dist/images/marker-shadow.png',
          'https://unpkg.com/leaflet@1.3.1/dist/images/marker-icon.png',
          'https://unpkg.com/leaflet@1.3.1/dist/images/marker-icon-2x.png'
        ]);
    })
  );
});

/**
 * activate service worker
 */
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          // Return true if you want to remove this cache,
          // but remember that caches are shared across
          // the whole origin
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});


self.addEventListener('fetch', function (event) {
    event.respondWith(caches.match(event.request).then(function (response) {
      //if (response ) console.log('Found in cache!', event.request.url);
      return response || fetch(event.request);
    }));
    return;
});

