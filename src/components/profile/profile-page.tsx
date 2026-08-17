"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, LogOut } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { AuthInput } from "@/components/auth/auth-input";
import { Button } from "@/components/ui/button";

export function ProfilePage() {
  const { user, updateProfile, logout, isLoading, error, setError } = useAuthStore();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string }>({});
  const [success, setSuccess] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.assign("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const errors: { name?: string; email?: string } = {};
    if (name.trim().length < 2) errors.name = "Name must be at least 2 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = "Enter a valid email address";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await updateProfile({ name: name.trim(), email: email.trim() });
      setSuccess(true);
    } catch {
      // error stored in auth store
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
            <span className="text-white text-sm font-semibold tracking-tight">Profile</span>
          </div>
          <Button variant="secondary" size="sm" onClick={handleLogout} disabled={isLoading}>
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="glass rounded-2xl p-6 md:p-8">
          <h1 className="text-xl font-bold text-text mb-6">Edit Profile</h1>

          {error ? (
            <div className="mb-5 rounded-lg bg-error/10 border border-error/30 px-4 py-3 text-sm text-error">{error}</div>
          ) : null}
          {success ? (
            <div className="mb-5 rounded-lg bg-success/10 border border-success/30 px-4 py-3 text-sm text-success">
              Profile updated successfully.
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <AuthInput
              label="Full name"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={fieldErrors.name}
            />
            <AuthInput
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors.email}
            />
            <Button type="submit" size="lg" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Save changes
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
