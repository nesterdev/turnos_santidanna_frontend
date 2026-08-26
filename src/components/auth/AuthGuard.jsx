// src/components/auth/AuthGuard.jsx
import { useEffect, useState } from "react";
import Loading from "../ui/Loading";

/**
 * @param {{ children: React.ReactNode, allowedRoles?: string[] }} props
 */
export default function AuthGuard({ children, allowedRoles = [] }) {
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const rawUser = localStorage.getItem("app_user");

    if (!token || !rawUser) {
      window.location.assign("/unauthorized");
      return;
    }

    try {
      const user = JSON.parse(rawUser);

      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        window.location.assign("/unauthorized");
        return;
      }

      setAuthorized(true);
    } catch {
      window.location.assign("/unauthorized");
    }
  }, [allowedRoles]);

  if (!authorized) {
    return <Loading fullscreen text="Verificando sesión..." />;
  }

  return children;
}