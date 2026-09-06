import { apiFetch } from "../utils/fetch";

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function registerPushNotifications() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push messaging is not supported in this browser');
    return false;
  }

  // Validación estricta para iOS: debe ser modo standalone (instalada en pantalla de inicio)
  const isIOS = /ipad|iphone|ipod/.test(navigator.userAgent.toLowerCase());
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  if (isIOS && !isStandalone) {
    console.warn('En iOS, las notificaciones push solo funcionan si la app está instalada en la pantalla de inicio.');
    return false;
  }

  try {
    // 1. Asegurar que el Service Worker esté listo
    const registration = await navigator.serviceWorker.ready;

    // 2. Verificar si ya existe una suscripción activa previa
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      // 3. Pedir permiso explícito al usuario (requiere gesto de clic)
      const permissionResult = await Notification.requestPermission();
      if (permissionResult !== 'granted') {
        console.warn('Permiso de notificaciones denegado por el usuario.');
        return false;
      }

      // 4. Obtener Llave Pública VAPID
      const publicVapidKey = import.meta.env.PUBLIC_VAPID_KEY;
      if (!publicVapidKey) {
        console.error('Falta la variable PUBLIC_VAPID_KEY en el cliente');
        return false;
      }

      // 5. Crear la suscripción push en el navegador
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      });
    }

    // 6. Enviar la suscripción al backend usando tu apiFetch
    await apiFetch('/push/subscribe', {
      method: 'POST',
      body: JSON.stringify({ subscription }),
    });

    console.log('¡Dispositivo suscrito y registrado exitosamente en el servidor!');
    return true;
  } catch (error) {
    console.error('Error al registrar las notificaciones push:', error);
    return false;
  }
}

export async function sendBroadcastNotification(payload) {
  return await apiFetch('/push/send-broadcast', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getPushSubscriptions() {
  return await apiFetch('/push/subscriptions', {
    method: 'GET',
  });
}

export async function deletePushSubscription(id) {
  return await apiFetch(`/push/subscriptions/${id}`, {
    method: 'DELETE',
  });
}