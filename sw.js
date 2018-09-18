if (typeof idb === "undefined") {
 self.importScripts('js/idb.js');
}

if (typeof DBHelper === "undefined") {
  self.importScripts('js/dbhelper.js');
}
/**
 * cache names
 */
var staticCacheName = 'restaurant-review-static';
var contentImgsCache = 'restaurant-review-imgs';
var allCaches = [
    staticCacheName,
    contentImgsCache
];

/**
 * combine create and add
 */
function storeJSONLocal(){
  fetch(DBHelper.DATABASE_URL)
   .then(response => response.json())
   .then(data =>{
    //open indexDB database and add data in this then
    idb.open('restaurant_info', 1, function(upgradeDB) {
      var store = upgradeDB.createObjectStore('restaurants', {
        keyPath: 'id'
      });
      //addJSON(store); // Fails here
   //store.put({id: 1, name: "name"});
 // for(i=0; i < data.length; i++){
   data.forEach(function(item){
    store.put(item);
    //  store.put({id:data[i].id,name: data[i].name});
    //  console.log(item); //test to see if this works
    });
  });
  });
}



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
          'js/main.js',
          'js/restaurant_info.js',
          '/registerSW.js',
          '/sw.js',
          'js/idb.js',
          'js/dbhelper.js',
          'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
          'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
          'https://unpkg.com/leaflet@1.3.1/dist/images/marker-shadow.png',
          'https://unpkg.com/leaflet@1.3.1/dist/images/marker-icon.png',
          'https://unpkg.com/leaflet@1.3.1/dist/images/marker-icon-2x.png',
          'https://api.tiles.mapbox.com/v4/mapbox.streets/13/2413/3080.jpg70?access_token=pk.eyJ1IjoiY2RhdmlzNCIsImEiOiJjamxpOHVvNnIwYjJnM3ByMjFwcW9jdjk5In0.WrX96W6zbl7Vo3Y8A2Vvfw'
        ]);
    })
  );
});

/**
 * activate service worker
 */
self.addEventListener('activate', function(event) {
  event.waitUntil(
   //createDB(),
   storeJSONLocal(),
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

//fetchRestaurantsIDB(){
 // idb.open('restaurant_info', 1).then(function(db) {
//    var tx = db.transaction(['restaurants'], 'readonly');
 //   var store = tx.objectStore('restaurants');
 //   return store.getAll()
 //   .then(items => {
    // Use restaurant data
 //     return items;
//    })
//  });
//}
self.addEventListener('fetch', function (event) {
  if(event.request.url === DBHelper.DATABASE_URL){
    console.log("using idb");
    idb.open('restaurant_info', 1).then(function(db) {
    var tx = db.transaction(['restaurants'], 'readonly');
    var store = tx.objectStore('restaurants');
    return store.getAll()
    .then(items => {
    // Use restaurant data
      return items;
    })
  });
  }
  else{
      event.respondWith(caches.match(event.request).then(function (response) {
        if (response ) console.log('Found in cache!', event.request.url);
        return response || fetch(event.request);
      }
    ));
  }
    return;
});

