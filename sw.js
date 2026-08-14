const CACHE='namseoul-v2-20260814';
const ASSETS=['./','./index.html','./data.js','./logo.png','./icon-192.png','./icon-512.png','./manifest.webmanifest','./finance-2026-06.png','./projects-original.png','./newsletter-2026-06.pdf','./gallery-1.jpg','./gallery-2.jpg','./gallery-3.jpg','./gallery-4.jpg','./gallery-5.jpg','./gallery-6.jpg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS.filter(Boolean))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{ if(e.request.method!=='GET') return; e.respondWith(fetch(e.request).then(r=>{const copy=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); return r;}).catch(()=>caches.match(e.request))); });
