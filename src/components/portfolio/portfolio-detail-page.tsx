"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Plus,
  Trash2,
  Code2,
  Globe,
  Save,
} from "lucide-react";
import { apiRequest } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { AuthInput } from "@/components/auth/auth-input";

interface PortfolioDetail {
  id: string;
  name: string;
  slug: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  technologies: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  createdAt: string;
}

export function PortfolioDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [portfolio, setPortfolio] = useState<PortfolioDetail | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [creating, setCreating] = useState(false);
  const [creatingError, setCreatingError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [portfolioRes, projectsRes] = await Promise.all([
        apiRequest<{ portfolio: PortfolioDetail }>(`/api/portfolios/${id}`),
        apiRequest<{ projects: Project[] }>(`/api/portfolios/${id}/projects`),
      ]);
      setPortfolio(portfolioRes.portfolio);
      setName(portfolioRes.portfolio.name);
      setProjects(projectsRes.projects);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load portfolio");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let active = true;
    Promise.all([
      apiRequest<{ portfolio: PortfolioDetail }>(`/api/portfolios/${id}`),
      apiRequest<{ projects: Project[] }>(`/api/portfolios/${id}/projects`),
    ])
      .then(([portfolioRes, projectsRes]) => {
        if (!active) return;
        setPortfolio(portfolioRes.portfolio);
        setName(portfolioRes.portfolio.name);
        setProjects(projectsRes.projects);
        setError(null);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Failed to load portfolio");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolio) return;
    setSavingName(true);
    setError(null);
    try {
      const result = await apiRequest<{ portfolio: PortfolioDetail }>(`/api/portfolios/${portfolio.id}`, {
        method: "PATCH",
        body: { name: name.trim() },
      });
      setPortfolio(result.portfolio);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to rename portfolio");
    } finally {
      setSavingName(false);
    }
  };

  const handleDeletePortfolio = async () => {
    if (!portfolio) return;
    if (!window.confirm("Delete this portfolio and all of its projects?")) return;
    try {
      await apiRequest(`/api/portfolios/${portfolio.id}`, { method: "DELETE" });
      window.location.assign("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete portfolio");
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingError(null);
    if (!title.trim()) {
      setCreatingError("Title is required");
      return;
    }
    setCreating(true);
    try {
      await apiRequest(`/api/portfolios/${id}/projects`, {
        method: "POST",
        body: {
          title: title.trim(),
          description: description.trim() || undefined,
          technologies: technologies
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
            .slice(0, 30),
          githubUrl: githubUrl.trim() || undefined,
          liveUrl: liveUrl.trim() || undefined,
        },
      });
      setTitle("");
      setDescription("");
      setTechnologies("");
      setGithubUrl("");
      setLiveUrl("");
      setShowForm(false);
      await load();
    } catch (err) {
      setCreatingError(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm("Delete this project?")) return;
    setDeletingId(projectId);
    try {
      await apiRequest(`/api/portfolios/${id}/projects/${projectId}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading && !portfolio) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="w-7 h-7 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border-subtle bg-bg/80 backdrop-blur-md sticky top-0 z-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-text-muted hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-white text-sm font-semibold tracking-tight truncate">
              {portfolio?.name ?? "Portfolio"}
            </span>
          </div>
          <Link
            href="/generation"
            className="inline-flex items-center justify-center rounded-lg bg-primary text-white text-sm font-medium px-3 sm:px-4 py-2 hover:bg-primary-hover transition-colors"
          >
            <span className="hidden sm:inline">Generate with AI</span>
            <span className="sm:hidden">Generate</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10">
        {error ? (
          <div className="mb-6 rounded-lg bg-error/10 border border-error/30 px-4 py-3 text-sm text-error">{error}</div>
        ) : null}

        <section className="glass rounded-2xl p-6 md:p-8 mb-10">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-text">{portfolio?.name}</h1>
              <p className="text-sm text-text-muted mt-1">/ {portfolio?.slug}</p>
            </div>
            <button
              onClick={handleDeletePortfolio}
              className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-error transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" /> Delete portfolio
            </button>
          </div>

          <form onSubmit={handleRename} className="flex flex-col sm:flex-row sm:items-end gap-3">
            <div className="flex-1">
              <AuthInput label="Portfolio name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <Button type="submit" disabled={savingName}>
              {savingName ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Rename
            </Button>
          </form>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text">Projects</h2>
            <Button size="sm" onClick={() => setShowForm((v) => !v)}>
              {showForm ? null : <Plus className="w-4 h-4" />}
              {showForm ? "Cancel" : "Add project"}
            </Button>
          </div>

          {showForm ? (
            <form onSubmit={handleCreateProject} className="glass rounded-xl p-6 mb-6 space-y-4">
              {creatingError ? (
                <div className="rounded-lg bg-error/10 border border-error/30 px-4 py-3 text-sm text-error">
                  {creatingError}
                </div>
              ) : null}
              <AuthInput
                label="Project title"
                name="projectTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={creatingError && !title.trim() ? creatingError : undefined}
              />
              <div className="space-y-1.5">
                <label htmlFor="projectDescription" className="block text-sm font-medium text-text-secondary">
                  Description
                </label>
                <textarea
                  id="projectDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="What does this project do?"
                  className="w-full rounded-lg bg-bg-card border border-border px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                />
              </div>
              <AuthInput
                label="Technologies (comma separated)"
                name="technologies"
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
                placeholder="React, TypeScript, Tailwind"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AuthInput
                  label="GitHub URL"
                  name="githubUrl"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                />
                <AuthInput
                  label="Live URL"
                  name="liveUrl"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <Button type="submit" disabled={creating}>
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Create project
              </Button>
            </form>
          ) : null}

          {projects.length === 0 && !showForm ? (
            <div className="glass rounded-xl p-8 text-center text-sm text-text-muted">
              No projects in this portfolio yet. Add one above.
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="glass rounded-xl p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-text">{project.title}</h3>
                      {project.description ? (
                        <p className="text-sm text-text-secondary mt-1">{project.description}</p>
                      ) : null}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {project.technologies.map((tech) => (
                          <span key={tech} className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      disabled={deletingId === project.id}
                      className="text-text-muted hover:text-error transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                      aria-label={`Delete ${project.title}`}
                    >
                      {deletingId === project.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-sm">
                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-text-muted hover:text-primary transition-colors"
                      >
                        <Code2 className="w-4 h-4" /> Source
                      </a>
                    ) : null}
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-text-muted hover:text-primary transition-colors"
                      >
                        <Globe className="w-4 h-4" /> Live
                      </a>
                    ) : null}
                    <span className="ml-auto text-xs text-text-muted">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
