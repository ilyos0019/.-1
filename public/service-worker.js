const CACHE_NAME = 'usta-top-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/admin.html',
    '/dashboard.html',
    '/login.html',
    '/register.html',
    '/worker.html',
    '/master-profile.html',
    '/config.js',
    '/css/style.css',
    '/css/landing.css',
    '/css/glass-theme.css',
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png'
];

// Install Event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching assets');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Activate Event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Clearing old cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Fetch Event - Cache First Strategy
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return from cache if found, else fetch from network
            return response || fetch(event.request).catch(() => {
                // If both fail (offline and not in cache), return index.html as fallback for navigation
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
            });
        })
    );
});
