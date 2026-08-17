"use client";

import { RequireAuth } from "@/components/auth/auth-guard";
import { SettingsPage } from "@/components/settings/settings-page";

export default function Settings() {
  return (
    <RequireAuth>
      <SettingsPage />
    </RequireAuth>
  );
}
