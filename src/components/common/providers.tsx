"use client";

import { type ReactNode } from "react";
import { PageTransition } from "./page-transition";
import { AuthProvider } from "@/components/auth/auth-provider";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <PageTransition>{children}</PageTransition>
    </AuthProvider>
  );
}
