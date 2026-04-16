"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";
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
        console.error("Error creating project:", error);
        throw new Error(error.message);
    }

    revalidatePath("/admin/project");
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
        console.error("Error updating project:", error);
        throw new Error(error.message);
    }

    revalidatePath("/admin/project");
    revalidatePath(`/admin/project/edit/${id}`);
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
    if (project && (project.featured_image || project.featured_image_id)) {
        const mediaId = project.featured_image || project.featured_image_id;
        const { data: media } = await supabase
            .from("media")
            .select("*")
            .eq("id", mediaId)
            .single();
        if (media) {
            (project as any).featured_image = media;
            (project as any).imageUrl = media.url;
            (project as any).image_url = media.url;
        }
    }

    return project;
}

export async function getAllProjects() {
    const supabase = await createClient();
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
            .map(p => p.featured_image || p.featured_image_id)
            .filter(id => !!id) as string[];
        
        if (mediaIds.length > 0) {
            const { data: media } = await supabase
                .from("media")
                .select("*")
                .in("id", mediaIds);
            
            if (media) {
                return projects.map(project => {
                    const mediaId = project.featured_image || project.featured_image_id;
                    const featured_image = media.find(m => m.id === mediaId);
                    return {
                        ...project,
                        featured_image,
                        imageUrl: featured_image?.url,
                        image_url: featured_image?.url
                    };
                });
            }
        }
    }

    return projects;
}
