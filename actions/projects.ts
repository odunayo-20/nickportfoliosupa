"use server";

import { createClient, createStaticClient } from "@/lib/server";
import { revalidatePath, unstable_cache, revalidateTag } from "next/cache";
import { cache } from "react";
import { Database } from "@/types/database";

type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

export async function createProject(data: ProjectInsert) {
    const supabase = await createClient();
    const { data: project, error } = await supabase
        .from("projects")
        .insert(data)
        .select("id")
        .single();

    if (error) {
        // console.error("Error creating project:", error);
        throw new Error(error.message);
    }

    revalidatePath("/admin/project");
    revalidateTag("projects", "max");
    return project;
}

export async function updateProject(id: string, data: ProjectUpdate) {
    const supabase = await createClient();
    const { data: project, error } = await supabase
        .from("projects")
        .update(data)
        .eq("id", id)
        .select("id")
        .single();

    if (error) {
        // console.error("Error updating project:", error);
        throw new Error(error.message);
    }

    revalidatePath("/admin/project");
    revalidatePath(`/admin/project/edit/${id}`);
    revalidatePath(`/admin/project/show/${id}`);
    revalidateTag("projects", "max");
    return project;
}

export async function deleteProject(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting project:", error);
        throw new Error(error.message);
    }

    revalidatePath("/admin/project");
    revalidateTag("projects", "max");
}

export async function bulkDeleteProjects(ids: string[]) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("projects")
        .delete()
        .in("id", ids);

    if (error) {
        console.error("Error bulk deleting projects:", error);
        throw new Error(error.message);
    }

    revalidatePath("/admin/project");
    revalidateTag("projects", "max");
}

export async function bulkUpdateProjectStatus(ids: string[], status: "draft" | "published") {
    const supabase = await createClient();
    const { error } = await supabase
        .from("projects")
        .update({ status })
        .in("id", ids);

    if (error) {
        console.error("Error bulk updating project status:", error);
        throw new Error(error.message);
    }

    revalidatePath("/admin/project");
    revalidateTag("projects", "max");
}

export async function getProjectById(id: string) {
    const supabase = await createClient();
    const { data: project, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching project:", error);
        return null;
    }

    // Manual join for featured_image to avoid PostgREST schema cache issues with relation joins
    if (project && project.featured_image) {
        const { data: media } = await supabase
            .from("media")
            .select("*")
            .eq("id", project.featured_image)
            .single();
        if (media) {
            (project as any).featured_image_media = media;
            (project as any).imageUrl = media.url;
            (project as any).image_url = media.url;
        }
    }

    return project;
}

export const getAllProjects = cache(unstable_cache(
    async () => {
        const supabase = createStaticClient();
        const { data: projects, error } = await supabase
            .from("projects")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching projects:", error);
            return [];
        }

        if (projects && projects.length > 0) {
            const mediaIds = projects
                .map(p => p.featured_image)
                .filter(id => !!id) as string[];
            
            if (mediaIds.length > 0) {
                const { data: media } = await supabase
                    .from("media")
                    .select("*")
                    .in("id", mediaIds);
                
                if (media) {
                    return projects.map(project => {
                        const featured_image_media = media.find(m => m.id === project.featured_image);
                        return {
                            ...project,
                            featured_image_media,
                            imageUrl: featured_image_media?.url,
                            image_url: featured_image_media?.url
                        };
                    });
                }
            }
        }

        return projects;
    },
    ["all-projects"],
    { tags: ["projects"] }
));

export const getPublishedProjects = cache(unstable_cache(
    async () => {
        const supabase = createStaticClient();
        const { data: projects, error } = await supabase
            .from("projects")
            .select("*")
            .eq("status", "published")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching published projects:", error);
            return [];
        }

        if (projects && projects.length > 0) {
            const mediaIds = projects
                .map(p => p.featured_image)
                .filter(id => !!id) as string[];
            
            if (mediaIds.length > 0) {
                const { data: media } = await supabase
                    .from("media")
                    .select("*")
                    .in("id", mediaIds);
                
                if (media) {
                    return projects.map(project => {
                        const featured_image_media = media.find(m => m.id === project.featured_image);
                        return {
                            ...project,
                            featured_image_media,
                            imageUrl: featured_image_media?.url,
                            image_url: featured_image_media?.url
                        };
                    });
                }
            }
        }

        return projects;
    },
    ["published-projects"],
    { tags: ["projects"] }
));

export const getProjectBySlug = cache(async (slug: string) => {
    return unstable_cache(
        async () => {
            const supabase = createStaticClient();
            
            const { data: project, error } = await supabase
                .from("projects")
                .select("*")
                .eq("slug", slug)
                .eq("status", "published")
                .single();

            if (error) {
                console.error("Error fetching project by slug:", error.message);
                return null;
            }

            if (project && project.featured_image) {
                const { data: media } = await supabase
                    .from("media")
                    .select("*")
                    .eq("id", project.featured_image)
                    .single();
                if (media) {
                    (project as any).featured_image_media = media;
                    (project as any).imageUrl = media.url;
                    (project as any).image_url = media.url;
                }
            }

            if (project && project.media_ids && project.media_ids.length > 0) {
                const { data: galleryMedia } = await supabase
                    .from("media")
                    .select("*")
                    .in("id", project.media_ids);
                if (galleryMedia) {
                    (project as any).gallery_media = galleryMedia;
                    (project as any).additionalImages = galleryMedia.map((m: any) => m.url);
                }
            }

            return project;
        },
        [`project-${slug}`],
        { tags: ["projects", `project-${slug}`] }
    )();
});