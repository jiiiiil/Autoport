"use client";

import { RequireAuth } from "@/components/auth/auth-guard";
import { ProfilePage } from "@/components/profile/profile-page";

export default function Profile() {
  return (
    <RequireAuth>
      <ProfilePage />
    </RequireAuth>
  );
}
