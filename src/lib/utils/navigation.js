// src/lib/utils/navigation.js

export function redirect(path, delay = 1200) {
  setTimeout(() => {
    window.location.href = path;
  }, delay);
}
