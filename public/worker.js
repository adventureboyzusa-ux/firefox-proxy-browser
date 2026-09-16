const CACHE = "browser-shell-v1";
self.addEventListener("install", (event) => { self.skipWaiting(); event.waitUntil(caches.open(CACHE)); });
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cached = await caches.match(request);
    try {
      const response = await fetch(request);
      if (response.ok && request.url.includes("/assets/")) {
        const cache = await caches.open(CACHE);
        cache.put(request, response.clone());
      }
      return response;
    } catch { return cached || Response.error(); }
  })());
});
