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
    vibrate: [200, 100, 200, 100, 200, 100, 200], // Patrón de vibración más marcado
    data: { url: data.url || '/' },
    
    // --- PROPIEDADES CLAVE PARA ANDROID ---
    tag: 'variedades-santi-notification', // Evita que se amontonen y fuerza actualización
    renotify: true,                      // Fuerza a que vibre y suene aunque haya otra notificación previa sin leer
    requireInteraction: true,            // Mantiene la notificación visible hasta que el usuario la toque
    
    // Forzar alta prioridad y canal por defecto con sonido en Chrome/Android
    priority: 2,                         // Prioridad alta para navegadores antiguos
    urgency: 'high'                      // Urgencia alta para el estándar de Web Push
  };

  const badgePromise = self.navigator?.setAppBadge
    ? self.navigator.setAppBadge(data.badgeCount || 1)
    : Promise.resolve();

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