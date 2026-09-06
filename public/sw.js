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

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'Nueva notificación', body: 'Tienes un nuevo mensaje' };

  const options = {
    body: data.body,
    icon: '/variedades_santidana_192x192.png',
    badge: '/variedades_santidana_192x192.png',
    vibrate: [200, 100, 200, 100, 200], // Patrón de vibración soportado en Android
    data: { url: data.url || '/' }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});