/**
 * register service worker
 */
if('serviceWorker' in navigator)
{
  window.addEventListener('load', function(){
    navigator.serviceWorker.register('/sw.js').then(function(registration){
      //Registration was successful
      if ('sync' in registration) {
        console.log('sync is in registry');
      }
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err){
      // registration failed
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}