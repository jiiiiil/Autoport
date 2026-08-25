"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Trash2,
  FolderOpen,
  History,
  LogOut,
  Loader2,
  ExternalLink,
  Menu,
  X,
  User,
  Settings,
  Rocket,
} from "lucide-react";
import { apiRequest } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";

interface DashboardData {
  user: { id: string; name: string; email: string; createdAt: string };
  stats: { portfolioCount: number; generationCount: number };
  portfolios: Array<{
    id: string;
    name: string;
    slug: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    _count: { generations: number };
  }>;
  generations: Array<{
    id: string;
    prompt: string;
    status: string;
    duration: number | null;
    createdAt: string;
    portfolio: { id: string; name: string; slug: string } | null;
  }>;
}

function formatDate(value: string): string {
  try {
    return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return value;
  }
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="glass rounded-xl p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center">{icon}</div>
      <div>
        <div className="text-2xl font-bold text-text-primary leading-none">{value}</div>
        <div className="text-xs text-text-muted mt-1 font-semibold">{label}</div>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { user, logout, isLoading: authLoading } = useAuthStore();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const loadDashboard = useCallback(async () => {
    try {
      const result = await apiRequest<DashboardData>("/api/dashboard");
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    apiRequest<DashboardData>("/api/dashboard")
      .then((result) => {
        if (!active) return;
        setData(result);
        setError(null);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Failed to load dashboard");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleDeletePortfolio = async (id: string) => {
    if (!window.confirm("Delete this portfolio?")) return;
    setDeletingId(id);
    try {
      await apiRequest(`/api/portfolios/${id}`, { method: "DELETE" });
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete portfolio");
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.assign("/");
  };

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border-subtle bg-bg/80 backdrop-blur-md sticky top-0 z-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <span className="text-text-primary text-xs font-bold">A</span>
            </div>
            <span className="text-text-primary text-sm font-semibold tracking-tight">AI Portfolio</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="hidden md:flex items-center gap-5 text-sm">
              <Link href="/profile" className="text-text-primary hover:text-primary transition-colors">
                Profile
              </Link>
              <Link href="/settings" className="text-text-primary hover:text-primary transition-colors">
                Settings
              </Link>
            </nav>
            <Button variant="secondary" size="sm" onClick={handleLogout} disabled={authLoading} className="hidden sm:inline-flex">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
            <button
              onClick={() => setMobileNavOpen((v) => !v)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-text-primary hover:text-primary hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {mobileNavOpen && (
          <div className="md:hidden border-t border-border-subtle bg-bg-card px-4 py-3 space-y-1">
            <Link href="/profile" onClick={() => setMobileNavOpen(false)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-text-primary hover:text-primary hover:bg-black/5 transition-colors">
              <User className="w-4 h-4" /> Profile
            </Link>
            <Link href="/settings" onClick={() => setMobileNavOpen(false)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-text-primary hover:text-primary hover:bg-black/5 transition-colors">
              <Settings className="w-4 h-4" /> Settings
            </Link>
            <button onClick={handleLogout} disabled={authLoading} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-text-primary hover:text-error hover:bg-black/5 transition-colors cursor-pointer disabled:opacity-50">
              <LogOut className="w-4 h-4" /> Log out
            </button>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-10">
        <div className="mb-8">
          <p className="text-sm text-text-muted">Welcome back</p>
          <h1 className="text-2xl md:text-3xl font-bold text-text mt-1">
            {data?.user?.name ?? user?.name ?? "Your Dashboard"}
          </h1>
          <p className="text-sm text-text-muted mt-1">{data?.user?.email ?? user?.email}</p>
        </div>

        {error ? (
          <div className="mb-6 rounded-lg bg-error/10 border border-error/30 px-4 py-3 text-sm text-error">{error}</div>
        ) : null}

        {loading && !data ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-7 h-7 text-primary animate-spin" />
          </div>
        ) : data ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <StatCard icon={<FolderOpen className="w-5 h-5" />} label="Portfolios" value={data.stats.portfolioCount} />
              <StatCard icon={<History className="w-5 h-5" />} label="Generations" value={data.stats.generationCount} />
            </div>

            <section className="mb-12">
              <h2 className="text-lg font-semibold text-text mb-4">Your Portfolios</h2>

              {data.portfolios.length === 0 ? (
                <div className="glass rounded-xl p-8 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/15 text-primary flex items-center justify-center mb-3">
                    <FolderOpen className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-text-primary font-semibold">
                    You don&apos;t have any portfolios yet.{" "}
                    <Link href="/upload" className="text-primary hover:text-primary-hover">
                      Upload your resume
                    </Link>{" "}
                    to create your first portfolio.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.portfolios.map((portfolio) => (
                    <div key={portfolio.id} className="glass rounded-xl p-5 flex flex-col gap-3 group">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/portfolios/${portfolio.id}`} className="min-w-0">
                          <h3 className="font-semibold text-text truncate group-hover:text-primary transition-colors">
                            {portfolio.name}
                          </h3>
                          <p className="text-xs text-text-muted truncate">/{portfolio.slug}</p>
                        </Link>
                        <button
                          onClick={() => handleDeletePortfolio(portfolio.id)}
                          disabled={deletingId === portfolio.id}
                          className="text-text-muted hover:text-error transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                          aria-label={`Delete ${portfolio.name}`}
                        >
                          {deletingId === portfolio.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-text-primary">
                        <span>{portfolio._count.generations} generations</span>
                        <span className="capitalize">
                          {portfolio._count.generations === 0 ? "Draft" : portfolio.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xs text-text-muted">{formatDate(portfolio.updatedAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Rocket className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-text">Generation History</h2>
              </div>
              {data.generations.length === 0 ? (
                <div className="glass rounded-xl p-8 text-center text-sm text-text-primary font-semibold">
                  No generations yet.{" "}
                  <Link href="/upload" className="text-primary hover:text-primary-hover">
                    Upload your resume
                  </Link>{" "}
                  to create a portfolio.
                </div>
              ) : (
                <div className="glass rounded-xl divide-y divide-border-subtle">
                  {data.generations.slice(0, 10).map((generation) => (
                    <div key={generation.id} className="flex items-center justify-between gap-4 px-5 py-3">
                      <div className="min-w-0">
                        <p className="text-sm text-text truncate">{generation.prompt}</p>
                        <p className="text-xs text-text-muted mt-0.5">
                          {formatDate(generation.createdAt)}
                          {generation.duration ? ` · ${(generation.duration / 1000).toFixed(1)}s` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-md ${
                            generation.status === "completed"
                              ? "bg-success/15 text-success"
                              : generation.status === "failed"
                                ? "bg-error/15 text-error"
                                : "bg-warning/15 text-warning"
                          }`}
                        >
                          {generation.status}
                        </span>
                        {generation.status === "completed" && generation.portfolio ? (
                          <Link
                            href="/preview"
                            className="text-xs text-primary hover:text-primary-hover"
                          >
                            View
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}
