var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
	'/pwa/'
];

// Perform install steps
// self.addEventListener('install', event => {
// 	event.waitUntil(
// 		caches.open(CACHE_NAME).then(function (cache) {
// 			console.log('Opened cache');
// 			return cache.addAll(urlsToCache);
// 		})
// 	);
// });

//Install stage sets up the offline page in the cache and opens a new cache
self.addEventListener('install', event => {

	event.waitUntil(
		caches.open(CACHE_NAME).then(function (cache) {
			console.log('[PWA Builder] Cached offline page during Install');
			return cache.addAll(urlsToCache);
		})
	);
});

self.addEventListener('fetch', function (event) {
	event.respondWith(
		caches.match(event.request)
			.then(function (response) {
				// Cache hit - return response
				if (response) {
					return response;
				}

				// IMPORTANT: Clone the request. A request is a stream and
				// can only be consumed once. Since we are consuming this
				// once by cache and once by the browser for fetch, we need
				// to clone the response.
				var fetchRequest = event.request.clone();

				return fetch(fetchRequest, { credentials: 'include' }).then(
					function (response) {
						// Check if we received a valid response
						if (!response || response.status !== 200 || response.type !== 'basic') {
							return response;
						}

						// IMPORTANT: Clone the response. A response is a stream
						// and because we want the browser to consume the response
						// as well as the cache consuming the response, we need
						// to clone it so we have two streams.
						var responseToCache = response.clone();

						caches.open(CACHE_NAME)
							.then(function (cache) {
								cache.put(event.request, responseToCache);
							});

						return response;
					}
				);
			})
	);
});

self.addEventListener('activate', function (event) {

	var cacheWhitelist = ['pwa-demo-cache-v1', 'pwa-demo-cache-v2'];

	event.waitUntil(
		caches.keys().then(function (cacheNames) {
			return Promise.all(
				cacheNames.map(function (cacheName) {
					if (cacheWhitelist.indexOf(cacheName) === -1) {
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});

//self.addEventListener('fetch', function(event) {
//	
//  event.respondWith(
//	caches.match(event.request).then(function(response) {
//      return response || fetchAndCache(event.request);
//    })
//  );
//});
//
//function fetchAndCache(url) {
//  
//  return fetch(url).then(function(response) {
//    
//	// Check if we received a valid response
//    if (!response.ok) {
//		console.log("blaa");
//      throw Error(response.statusText);
//    }
//    
//	return caches.open(CACHE_NAME).then(function(cache) {
//      cache.put(url, response.clone());
//      return response;
//    });
//  })
//  .catch(function(error) {
//    console.log('Request failed:', error);
//    // You could return a custom offline 404 page here
//  });
//}

//If any fetch fails, it will show the offline page. Maybe this should be limited to HTML documents?
//self.addEventListener('fetch', function(event) {
//  event.respondWith(
//    fetch(event.request).catch(function(error) {
//      console.error( '[PWA Builder] Network request Failed. Serving offline page ' + error );
//      return caches.open(CACHE_NAME).then(function(cache) {
//        return cache.match('offline.html');
//      });
//    }
//  ));
//});
//
////This is a event that can be fired from your page to tell the SW to update the offline page
//self.addEventListener('refreshOffline', function(response) {
//  return caches.open(CACHE_NAME).then(function(cache) {
//    console.log('[PWA Builder] Offline page updated from refreshOffline event: '+ response.url);
//    return cache.put(offlinePage, response);
//  });
//});

////Install stage sets up the index page (home page) in the cahche and opens a new cache
//self.addEventListener('install', function(event) {
//  var indexPage = new Request('offline.html');
//  event.waitUntil(
//    fetch(indexPage).then(function(response) {
//      return caches.open(CACHE_NAME).then(function(cache) {
//        console.log('[PWA Builder] Cached index page during Install'+ response.url);
//        return cache.put(indexPage, response);
//      });
//  }));
//});
//
////If any fetch fails, it will look for the request in the cache and serve it from there first
//self.addEventListener('fetch', function(event) {
//  
//  var updateCache = function(request){
//    return caches.open(CACHE_NAME).then(function (cache) {
//      return fetch(request).then(function (response) {
//        console.log('[PWA Builder] add page to offline'+response.url)
//        return cache.put(request, response);
//      });
//    });
//  };
//  
//  event.waitUntil(updateCache(event.request));
//  
//  event.respondWith(
//    fetch(event.request).catch(function(error) {
//      console.log( '[PWA Builder] Network request Failed. Serving content from cache: ' + error );
//      //Check to see if you have it in the cache
//	  //Return response
//      //If not in the cache, then return error page
//      return caches.open(CACHE_NAME).then(function (cache) {
//        return cache.match(event.request).then(function (matching) {
//          var report =  !matching || matching.status == 404?Promise.reject('no-match'): matching;
//          return report
//        });
//      });
//    })
//  );
//})





