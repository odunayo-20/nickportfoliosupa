"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";
import { Database } from "@/types/database";

type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];
type PostUpdate = Database["public"]["Tables"]["posts"]["Update"];

export async function createPost(data: PostInsert) {
    const supabase = await createClient();
    
    // Get current user to set as author
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: post, error } = await supabase
        .from("posts")
        .insert({
            ...data,
            author_id: data.author_id || user?.id
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating post:", error);
        throw new Error(error.message);
    }

    revalidatePath("/admin/blog");
    return post;
}

export async function updatePost(id: string, data: PostUpdate) {
    const supabase = await createClient();
    const { data: post, error } = await supabase
        .from("posts")
        .update(data)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating post:", error);
        throw new Error(error.message);
    }

    revalidatePath("/admin/blog");
    revalidatePath(`/admin/blog/edit/${id}`);
    return post;
}

export async function deletePost(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting post:", error);
        throw new Error(error.message);
    }

    revalidatePath("/admin/blog");
}

export async function getPostById(id: string) {
    const supabase = await createClient();
    console.log("Fetching post by ID:", id);
    
    const { data: post, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching post [ID:", id, "]:", error.message, error.details, error.hint);
        return null;
    }

    // Hand-roll the featured image join since the relationship cache might be stale
    if (post && post.featured_image_id) {
        const { data: media } = await supabase
            .from("media")
            .select("*")
            .eq("id", post.featured_image_id)
            .single();
        if (media) {
            post.featured_image = media;
            post.imageUrl = media.url;
            post.image_url = media.url;
        }
    }

    return post;
}

export async function getAllPosts() {
    const supabase = await createClient();
    const { data: posts, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching posts:", error);
        return [];
    }

    if (posts && posts.length > 0) {
        const mediaIds = posts
            .map(p => p.featured_image_id)
            .filter(id => !!id);
        
        if (mediaIds.length > 0) {
            const { data: media } = await supabase
                .from("media")
                .select("*")
                .in("id", mediaIds);
            
            if (media) {
                return posts.map(post => {
                    const featured_image = media.find(m => m.id === post.featured_image_id);
                    return {
                        ...post,
                        featured_image,
                        imageUrl: featured_image?.url,
                        image_url: featured_image?.url
                    };
                });
            }
        }
    }

    return posts;
}
