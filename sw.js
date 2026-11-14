// Offline support for the home screen app.
// The page is fetched from the network first (so updates arrive straight away) and falls back to the saved copy offline.
// To force every device to drop its saved copy, change VERSION.
const VERSION = 'nonograms-v1';
const CORE = ['./', 'manifest.webmanifest', 'icons/apple-touch-icon.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'];
const FONTS = /^https:\/\/fonts\.(googleapis|gstatic)\.com\//;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Network first, with a time limit so a weak connection doesn't leave a blank screen.
function networkFirst(req, key) {
  return caches.open(VERSION).then(cache => new Promise(resolve => {
    let done = false;
    const fallback = () => cache.match(key).then(r => r || cache.match(req, { ignoreSearch: true }));
    const timer = setTimeout(() => fallback().then(r => { if (r && !done) { done = true; resolve(r); } }), 4000);
    fetch(req).then(res => {
      if (res.ok) cache.put(key, res.clone());
      if (!done) { done = true; clearTimeout(timer); resolve(res); }
    }).catch(() => fallback().then(r => {
      if (!done) { done = true; clearTimeout(timer); resolve(r || Response.error()); }
    }));
  }));
}

// Saved copy first, then the network (fonts and icons rarely change).
function cacheFirst(req) {
  return caches.open(VERSION).then(cache => cache.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
    return res;
  })));
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (req.mode === 'navigate') { e.respondWith(networkFirst(req, './')); return; }
  if (FONTS.test(req.url)) { e.respondWith(cacheFirst(req)); return; }
  if (url.origin === location.origin) e.respondWith(url.pathname.endsWith('.webmanifest') ? networkFirst(req, req) : cacheFirst(req));
});
