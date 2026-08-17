"use client";

import { create } from "zustand";
import { apiRequest, ApiError } from "./api-client";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialized: boolean;
  error: string | null;

  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  updateProfile: (data: { name?: string; email?: string }) => Promise<void>;
  changePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
  clearAuth: () => void;
  setError: (message: string | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  initialized: false,
  error: null,

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await apiRequest<{ user: AuthUser }>("/api/auth/register", {
        method: "POST",
        body: data,
      });
      set({ user, isAuthenticated: true, isLoading: false, initialized: true, error: null });
    } catch (error) {
      set({ isLoading: false, error: error instanceof Error ? error.message : "Registration failed" });
      throw error;
    }
  },

  login: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await apiRequest<{ user: AuthUser }>("/api/auth/login", {
        method: "POST",
        body: data,
      });
      set({ user, isAuthenticated: true, isLoading: false, initialized: true, error: null });
    } catch (error) {
      set({ isLoading: false, error: error instanceof Error ? error.message : "Sign in failed" });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore network errors during logout
    } finally {
      get().clearAuth();
    }
  },

  fetchCurrentUser: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });
    try {
      const { user } = await apiRequest<{ user: AuthUser }>("/api/auth/me");
      set({ user, isAuthenticated: true, initialized: true, isLoading: false, error: null });
    } catch (error) {
      const isApiError = error instanceof ApiError;
      if (isApiError && error.status === 401) {
        set({ user: null, isAuthenticated: false, initialized: true, isLoading: false, error: null });
      } else {
        // Network/server failure — keep the app usable, mark initialized.
        set({ user: null, isAuthenticated: false, initialized: true, isLoading: false, error: null });
      }
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await apiRequest<{ user: AuthUser }>("/api/user/profile", {
        method: "PATCH",
        body: data,
      });
      set({ user, isLoading: false, error: null });
    } catch (error) {
      set({ isLoading: false, error: error instanceof Error ? error.message : "Profile update failed" });
      throw error;
    }
  },

  changePassword: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await apiRequest("/api/user/password", { method: "PATCH", body: data });
      set({ isLoading: false, error: null });
    } catch (error) {
      set({ isLoading: false, error: error instanceof Error ? error.message : "Password change failed" });
      throw error;
    }
  },

  clearAuth: () => {
    set({ user: null, isAuthenticated: false, initialized: true, isLoading: false, error: null });
  },

  setError: (message) => set({ error: message }),
}));
