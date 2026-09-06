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

  const isIOS = /ipad|iphone|ipod/.test(navigator.userAgent.toLowerCase());
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  if (isIOS && !isStandalone) {
    console.warn('En iOS, las notificaciones push solo funcionan si la app está instalada en la pantalla de inicio.');
    return false;
  }

  // QUITAMOS EL TRY/CATCH DE AQUÍ O PROPAGAMOS EL ERROR
  // para que si el backend falla, el componente React se entere de verdad.
  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    const permissionResult = await Notification.requestPermission();
    if (permissionResult !== 'granted') {
      throw new Error('Permiso de notificaciones denegado por el usuario.');
    }

    const publicVapidKey = import.meta.env.PUBLIC_VAPID_KEY;
    if (!publicVapidKey) {
      throw new Error('Falta la variable PUBLIC_VAPID_KEY en el cliente');
    }

    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
  }

  // Esto lanzará una excepción real a la consola y al componente si el servidor falla o no responde
  const response = await apiFetch('/push/subscribe', {
    method: 'POST',
    body: JSON.stringify({ subscription }),
  });

  console.log('¡Dispositivo suscrito y registrado exitosamente en el servidor!', response);
  return true;
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