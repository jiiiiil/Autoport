"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";

function AuthSkeleton() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-text-muted">Checking session...</p>
      </div>
    </div>
  );
}

/** Blocks access to protected pages until an authenticated session exists. */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, initialized } = useAuthStore();

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      const next = encodeURIComponent(pathname);
      router.replace(`/login?next=${next}`);
    }
  }, [initialized, isAuthenticated, pathname, router]);

  if (!initialized) return <AuthSkeleton />;
  if (!isAuthenticated) return <AuthSkeleton />;

  return <>{children}</>;
}

/** Blocks authenticated users from visiting guest-only pages (e.g. /login). */
export function RequireGuest({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, initialized } = useAuthStore();

  useEffect(() => {
    if (initialized && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [initialized, isAuthenticated, router]);

  if (!initialized) return <AuthSkeleton />;
  if (isAuthenticated) return <AuthSkeleton />;

  return <>{children}</>;
}
