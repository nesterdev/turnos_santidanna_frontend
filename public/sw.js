self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  self.clients.claim();
});

// Passthrough de red (manteniendo tu lógica de no cachear)
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});

// Manejador de Push robusto compatible con iOS y Android
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { 
      title: 'Variedades SantiDanna', 
      body: event.data ? event.data.text() : 'Tienes una nueva notificación' 
    };
  }

  const title = data.title || 'Variedades SantiDanna';
  const options = {
    body: data.body || '',
    icon: '/variedades_santidana_192x192.png',
    badge: '/variedades_santidana_192x192.png',
    vibrate: [200, 100, 200, 100, 200], // Soportado en Android
    data: { url: data.url || '/' }
  };

  // Badging API opcional para iOS / dispositivos compatibles
  const badgePromise = self.navigator?.setAppBadge
    ? self.navigator.setAppBadge(data.badgeCount || 1)
    : Promise.resolve();

  // OBLIGATORIO en iOS: Si no se llama a showNotification dentro de waitUntil, iOS cancela la suscripción
  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, options),
      badgePromise
    ])
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (self.navigator?.clearAppBadge) {
    self.navigator.clearAppBadge();
  }

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});