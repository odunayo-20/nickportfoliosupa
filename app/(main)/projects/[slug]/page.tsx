import { getProjectBySlug, getPublishedProjects } from "@/actions/projects";
import ProjectDetailsClient from "./ProjectDetailsClient";
import { notFound } from "next/navigation";
import { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const project = await getProjectBySlug(resolvedParams.slug);
  
  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const title = project.title;
  const description = project.description || `Case study for ${project.title}`;
  const projectUrl = `${BASE_URL}/projects/${resolvedParams.slug}`;

  return {
    title,
    description: description,
    alternates: {
      canonical: projectUrl,
    },
    openGraph: {
      title: `${title} | Case Study`,
      description: description,
      type: "article",
      url: projectUrl,
      // images come from ./opengraph-image.tsx (branded card)
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Case Study`,
      description: description,
    },
  };
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const [project, allProjects] = await Promise.all([
    getProjectBySlug(resolvedParams.slug),
    getPublishedProjects(),
  ]);

  if (!project) {
    notFound();
  }

  // Previous / next project in the same order as the /projects page (wraps around)
  type ListedProject = {
    slug: string; title: string; display_order?: number | null;
    imageUrl?: string | null; image_url?: string | null; category?: string | null;
  };
  const ordered = [...((allProjects ?? []) as ListedProject[])].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
  );
  const index = ordered.findIndex((p) => p.slug === project.slug);
  const pick = (p?: ListedProject) =>
    p && p.slug !== project.slug
      ? { slug: p.slug, title: p.title, imageUrl: p.imageUrl || p.image_url || null, category: p.category ?? null }
      : null;
  const adjacent =
    index === -1 || ordered.length < 2
      ? { prev: null, next: null }
      : {
          prev: pick(ordered[(index - 1 + ordered.length) % ordered.length]),
          next: pick(ordered[(index + 1) % ordered.length]),
        };

  return <ProjectDetailsClient project={project} adjacent={adjacent} />;
}