"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { AuthInput } from "./auth-input";
import { Button } from "@/components/ui/button";

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function RegisterForm() {
  const { register, isLoading, error, setError } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    if (name.trim().length < 2) errors.name = "Name must be at least 2 characters";
    if (!email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = "Enter a valid email address";
    if (password.length < 8) errors.password = "Password must be at least 8 characters";
    else if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      errors.password = "Password must contain at least one letter and one number";
    }
    if (confirmPassword !== password) errors.confirmPassword = "Passwords do not match";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    try {
      await register({ name, email, password });
      window.location.assign("/dashboard");
    } catch {
      // error is stored in the auth store
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {error ? (
        <div className="rounded-lg bg-error/10 border border-error/30 px-4 py-3 text-sm text-error">{error}</div>
      ) : null}

      <AuthInput
        label="Full name"
        name="name"
        autoComplete="name"
        placeholder="Jane Doe"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={fieldErrors.name}
      />

      <AuthInput
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={fieldErrors.email}
      />

      <AuthInput
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="At least 8 characters with a letter and number"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={fieldErrors.password}
        hint="Use at least 8 characters including a letter and a number."
      />

      <AuthInput
        label="Confirm password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        placeholder="Re-enter your password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={fieldErrors.confirmPassword}
      />

      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </Button>

      <p className="text-center text-sm text-text-muted">
        <Link href="/login" className="text-primary hover:text-primary-hover transition-colors">
          Already have an account? Sign in
        </Link>
      </p>
    </form>
  );
}
