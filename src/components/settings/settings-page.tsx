"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, LogOut } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { apiRequest } from "@/lib/api-client";
import { AuthInput } from "@/components/auth/auth-input";
import { Button } from "@/components/ui/button";

export function SettingsPage() {
  const { logout, changePassword, isLoading, error, setError } = useAuthStore();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<{ current?: string; new?: string; confirm?: string }>({});
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [theme, setTheme] = useState("dark");
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    void apiRequest<{ settings: { theme: string } }>("/api/user/settings")
      .then(({ settings }) => setTheme(settings.theme ?? "dark"))
      .catch(() => undefined);
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPasswordSuccess(false);

    const errors: { current?: string; new?: string; confirm?: string } = {};
    if (!currentPassword) errors.current = "Current password is required";
    if (newPassword.length < 8) errors.new = "New password must be at least 8 characters";
    else if (!/[a-zA-Z]/.test(newPassword) || !/\d/.test(newPassword)) {
      errors.new = "New password must contain at least one letter and one number";
    }
    if (confirmPassword !== newPassword) errors.confirm = "Passwords do not match";
    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess(true);
    } catch {
      // error stored in auth store
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSuccess(false);
    setSavingSettings(true);
    try {
      await apiRequest("/api/user/settings", { method: "PATCH", body: { theme } });
      setSettingsSuccess(true);
    } catch {
      // ignore
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border-subtle bg-bg/80 backdrop-blur-md sticky top-0 z-20">
        <div className="mx-auto max-w-3xl px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-text-muted hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-white text-sm font-semibold tracking-tight">Settings</span>
          </div>
          <Button variant="secondary" size="sm" onClick={handleLogout} disabled={isLoading}>
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 space-y-8">
        {error ? (
          <div className="rounded-lg bg-error/10 border border-error/30 px-4 py-3 text-sm text-error">{error}</div>
        ) : null}

        <section className="glass rounded-2xl p-6 md:p-8">
          <h1 className="text-xl font-bold text-text mb-1">Change Password</h1>
          <p className="text-sm text-text-muted mb-6">Update the password used to sign in to your account.</p>

          {passwordSuccess ? (
            <div className="mb-5 rounded-lg bg-success/10 border border-success/30 px-4 py-3 text-sm text-success">
              Password changed successfully.
            </div>
          ) : null}

          <form onSubmit={handlePasswordSubmit} className="space-y-5" noValidate>
            <AuthInput
              label="Current password"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              error={passwordErrors.current}
            />
            <AuthInput
              label="New password"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={passwordErrors.new}
              hint="At least 8 characters including a letter and a number."
            />
            <AuthInput
              label="Confirm new password"
              name="confirmNewPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={passwordErrors.confirm}
            />
            <Button type="submit" size="lg" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Update password
            </Button>
          </form>
        </section>

        <section className="glass rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-text mb-1">Preferences</h2>
          <p className="text-sm text-text-muted mb-6">Customize your workspace experience.</p>

          {settingsSuccess ? (
            <div className="mb-5 rounded-lg bg-success/10 border border-success/30 px-4 py-3 text-sm text-success">
              Preferences saved.
            </div>
          ) : null}

          <form onSubmit={handleSettingsSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="theme" className="block text-sm font-medium text-text-secondary">
                Theme
              </label>
              <select
                id="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full rounded-lg bg-bg-card border border-border px-3.5 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
            <Button type="submit" size="lg" disabled={savingSettings}>
              {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Save preferences
            </Button>
          </form>
        </section>
      </main>
    </div>
  );
}
