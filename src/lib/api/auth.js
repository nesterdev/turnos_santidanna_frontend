import { apiFetch } from "../utils/fetch";
import { saveToken } from "../utils/auth";
import { setUser } from "../stores/userStore";

export async function loginApi(email, password) {
  const res = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (res.token) {
    saveToken(res.token);
    setUser(res.user);
  }

  return res;
}

export async function registerApi(data) {
  const res = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return res;
}

export async function refreshTokenApi() {
  return apiFetch("/auth/refresh", { method: "GET" });
}
