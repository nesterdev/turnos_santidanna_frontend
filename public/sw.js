self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  self.clients.claim();
});

/**
 * PASSTHROUGH:
 * no cachea nada
 * todo va directo a la red
 */
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
