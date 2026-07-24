"use client";

import { type ReactNode } from "react";
import { PageTransition } from "./page-transition";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <PageTransition>{children}</PageTransition>;
}
