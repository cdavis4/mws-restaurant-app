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
 * use cache photos
 */
/**
function servePhoto(request) {
    var storageUrl = request.url.replace(/-\d+px\.jpg$/, '');
  
    return caches.open(contentImgsCache).then(function(cache) {
      return cache.match(storageUrl).then(function(response) {
        if (response) return response;
  
        return fetch(request).then(function(networkResponse) {
          cache.put(storageUrl, networkResponse.clone());
          return networkResponse;
        });
      });
    });
  }
  self.addEventListener('message', function(event) {
    if (event.data.action === 'skipWaiting') {
      self.skipWaiting();
    }
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
/**self.addEventListener('activate', function(event) {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.filter(function(cacheName) {
            return cacheName.startsWith('restaurant-review-') &&
                   !allCaches.includes(cacheName);
          }).map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      })
    );
  });
*/
/**
 * fetch service worker
 */
/**s
self.addEventListener('fetch', function(event) {
    var requestUrl = new URL(event.request.url);
  
    if (requestUrl.origin === location.origin) {
      if (requestUrl.pathname === '/') {
        event.respondWith(caches.match('/'));
        return;
      }
      if (requestUrl.pathname.startsWith('/img/')) {
        event.respondWith(servePhoto(event.request));
        return;
      }
    }
    event.respondWith(
        caches.match(event.request).then(function(response) {
          return response || fetch(event.request);
        })
      );
    });*/
    // The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
//self.addEventListener('fetch', function(event) {
 //   console.log(event.request.url);
 //  });

self.addEventListener('fetch', function (event) {
    event.respondWith(caches.match(event.request).then(function (response) {
      if (response ) console.log('Found in cache!', event.request.url);
      return response || fetch(event.request);
    }));
    return;
});


/*self.addEventListener('fetch', event => {
    if (event.request.mode === 'navigate') {
      // See /web/fundamentals/getting-started/primers/async-functions
      // for an async/await primer.
      event.respondWith(async function() {
        // Optional: Normalize the incoming URL by removing query parameters.
        // Instead of https://example.com/page?key=value,
        // use https://example.com/page when reading and writing to the cache.
        // For static HTML documents, it's unlikely your query parameters will
        // affect the HTML returned. But if you do use query parameters that
        // uniquely determine your HTML, modify this code to retain them.
        const normalizedUrl = new URL(event.request.url);
        normalizedUrl.search = '';
  
        // Create promises for both the network response,
        // and a copy of the response that can be used in the cache.
        const fetchResponseP = fetch(normalizedUrl);
        const fetchResponseCloneP = fetchResponseP.then(r => r.clone());
  
        // event.waitUntil() ensures that the service worker is kept alive
        // long enough to complete the cache update.
        event.waitUntil(async function() {
          const cache = await caches.open(staticCacheName );
          await cache.put(normalizedUrl, await fetchResponseCloneP);
        }());
  
        // Prefer the cached response, falling back to the fetch response.
        return (await caches.match(normalizedUrl)) || fetchResponseP;
      }());
    }
  });
/**
self.addEventListener('fetch', event => {
    // Skip cross-origin requests, like those for Google Analytics.
    if (event.request.url.startsWith(self.location.origin)) {
      event.respondWith(
        caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
  
          return caches.open(RUNTIME).then(cache => {
            return fetch(event.request).then(response => {
              // Put a copy of the response in the runtime cache.
              return cache.put(event.request, response.clone()).then(() => {
                return response;
              });
            });
          });
        })
      );
    }
  });*/