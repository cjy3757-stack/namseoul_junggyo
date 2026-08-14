// V3.0.2 cache kill-switch.
// This file intentionally does NOT cache the app.
self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
      await self.clients.claim();
      const clients = await self.clients.matchAll({type:"window", includeUncontrolled:true});
      for (const client of clients) {
        try {
          const url = new URL(client.url);
          url.searchParams.set("v","302");
          await client.navigate(url.toString());
        } catch(e) {}
      }
      // Remove this service worker after it has cleared the old registrations/caches.
      await self.registration.unregister();
    } catch(e) {}
  })());
});

self.addEventListener("fetch", event => {
  // Never return an old cached response. Always use the network.
  event.respondWith(fetch(event.request, {cache:"no-store"}).catch(() => fetch(event.request)));
});
