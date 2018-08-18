const CACHE_NAME = 'pwa-demo-cache-v12';
const urlsToCache = [
	'.',
	'./index.html',
	'./offline.html',
	'./images/pwa/android-chrome-36x36.png',
	'./images/pwa/android-chrome-48x48.png',
	'./images/pwa/android-chrome-72x72.png',
	'./images/pwa/android-chrome-96x96.png',
	'./images/pwa/android-chrome-144x144.png',
	'./images/pwa/android-chrome-192x192.png',
	'./images/pwa/android-chrome-256x256.png',
	'./images/pwa/android-chrome-384x384.png',
	'./images/pwa/android-chrome-512x512.png',
	'./images/pwa/apple-touch-icon.png',
	'./images/pwa/apple-touch-icon-60x60.png',
	'./images/pwa/apple-touch-icon-76x76.png',
	'./images/pwa/apple-touch-icon-120x120.png',
	'./images/pwa/apple-touch-icon-152x152.png',
	'./images/pwa/apple-touch-icon-180x180.png',
	'./images/pwa/favicon.ico',
	'./images/pwa/favicon-16x16.png',
	'./images/pwa/favicon-32x32.png',
	'./images/pwa/mstile-70x70.png',
	'./images/pwa/mstile-150x150.png',
	'./images/pwa/safari-pinned-tab.svg',
	'./images/ajour-system.jpg',
	'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
	'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js',
	'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.bundle.min.js',
	'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js',
	'https://code.jquery.com/jquery-3.3.1.slim.min.js'
];


self.registration.showNotification("Notification from Ajour PWA demo", {
	body: "Dette er en test",
	icon: "./images/pwa/favicon-32x32.png",
	image: "./images/ajour-system.jpg",
	badge: "./images/pwa/favicon-32x32.png",
	action: [
		{ action: "test", title: "Test knap", icon: "./images/pwa/favicon-32x32.png" }
	]
});

//This is the "Offline page" service worker
self.addEventListener('install', event => {

	console.log('SW \'%s\' Cached offline page during Install', CACHE_NAME);
	event.waitUntil(
		caches.open(CACHE_NAME).then(function (cache) {
			return cache.addAll(urlsToCache);
		})
	);
});

self.addEventListener('activate', event => {

	console.log('SW \'%s\' activated', CACHE_NAME);
	event.waitUntil(
		caches.keys().then(keys => {
			return Promise.all(keys.filter(key => {
				return key !== CACHE_NAME;
			}).map(key => {
				return caches.delete(key);
			}))

		})
	);
});

self.addEventListener('fetch', event => {

	event.respondWith(
		caches.match(event.fetch).then(res => {
			if (res) {
				return res;
			}

			if (!navigator.onLine) {
				return caches.match(new Request("./offline.html"));
			}

			return fecthAndUpdate(event.request);
		})
	);
});

function fecthAndUpdate(request) {
	return fetch(request).then(res => {
		if (res) {
			return caches.open(CACHE_NAME).then(cache => {
				return cache.put(request, res.clone()).then(() => {
					return res;
				});
			});
		}
	});
}
