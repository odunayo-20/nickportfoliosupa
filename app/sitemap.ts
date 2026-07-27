import type { MetadataRoute } from "next";
import { createStaticClient } from "@/lib/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Dynamically generates sitemap.xml for Google Search Console.
 * Static routes are always included; blog posts and projects are fetched
 * from Supabase so every published slug is automatically indexed.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticClient();

  // ── Fetch published blog post slugs ──────────────────────────────────────
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, updated_at, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  // ── Fetch published project slugs ─────────────────────────────────────────
  const { data: projects } = await supabase
    .from("projects")
    .select("slug, updated_at, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  // ── Static routes ─────────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cookies`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  // ── Dynamic blog post routes ───────────────────────────────────────────────
  const blogRoutes: MetadataRoute.Sitemap = (posts ?? [])
    .filter((p) => !!p.slug)
    .map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at ?? post.created_at ?? Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  // ── Dynamic project routes ─────────────────────────────────────────────────
  const projectRoutes: MetadataRoute.Sitemap = (projects ?? [])
    .filter((p) => !!p.slug)
    .map((project) => ({
      url: `${BASE_URL}/projects/${project.slug}`,
      lastModified: new Date(
        project.updated_at ?? project.created_at ?? Date.now()
      ),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  return [...staticRoutes, ...blogRoutes, ...projectRoutes];
}
