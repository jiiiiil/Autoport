"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";

/**
 * Initializes authentication state once on app start by calling /api/auth/me.
 * Listens for global `auth:unauthorized` events to clear stale sessions.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    void fetchCurrentUser();
  }, [fetchCurrentUser]);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearAuth();
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [clearAuth]);

  return <>{children}</>;
}
