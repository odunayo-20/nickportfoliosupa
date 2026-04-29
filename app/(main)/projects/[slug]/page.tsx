import { getProjectBySlug } from "@/actions/projects";
import ProjectDetailsClient from "./ProjectDetailsClient";
import { notFound } from "next/navigation";
import { Metadata } from "next";

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
  // Ensure we have a valid image URL, falling back to a default if necessary
  const imageUrl = (project as any).imageUrl || (project as any).image_url || "/logo.png";

  return {
    title: `${title} | Case Study`,
    description: description,
    openGraph: {
      title: `${title} | Case Study`,
      description: description,
      type: "article",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Case Study`,
      description: description,
      images: [imageUrl],
    },
  };
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const project = await getProjectBySlug(resolvedParams.slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailsClient project={project} />;
}