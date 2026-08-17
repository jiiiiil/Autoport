"use client";

import { RequireAuth } from "@/components/auth/auth-guard";
import { PortfolioDetailPage } from "@/components/portfolio/portfolio-detail-page";

export default function PortfolioDetail() {
  return (
    <RequireAuth>
      <PortfolioDetailPage />
    </RequireAuth>
  );
}
