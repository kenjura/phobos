const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
  '/',
  '/styles/index.css',
  '/components/ArticleView.js',
  '/components/HomeView.js',
  '/components/LoginView.js',
  '/components/NotFoundView.js',
  'https://unpkg.com/@vaadin/router',
  '../node_modules/dropbox',

];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
      	const url = event.request.url;

        // Cache hit - return response
        if (response) {
        	console.debug(`service-worker > fetch handler > cache hit for "${url}"`);
	        return response;
        } else {
        	console.debug(`service-worker > fetch handler > cache miss for "${url}"`);
        }
        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      }
    )
  );
});