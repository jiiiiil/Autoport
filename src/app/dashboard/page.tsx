"use client";

import { RequireAuth } from "@/components/auth/auth-guard";
import { DashboardPage } from "@/components/dashboard/dashboard-page";

export default function Dashboard() {
  return (
    <RequireAuth>
      <DashboardPage />
    </RequireAuth>
  );
}
