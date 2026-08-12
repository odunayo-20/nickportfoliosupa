"use server";

import { createClient, createStaticClient } from "@/lib/server";
import { revalidatePath, unstable_cache, revalidateTag } from "next/cache";
import { cache } from "react";
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
        // console.error("Error creating post:", error);
        throw new Error(error.message);
    }

    revalidatePath("/admin/blog");
    revalidateTag("posts", "max");
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
        // console.error("Error updating post:", error);
        throw new Error(error.message);
    }

    revalidatePath("/admin/blog");
    revalidatePath(`/admin/blog/edit/${id}`);
    revalidatePath(`/admin/blog/show/${id}`);
    revalidateTag("posts", "max");
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
    revalidateTag("posts", "max");
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

    // Hand-roll the image joins since the relationship cache might be stale
    const imageIds = [post.featured_image_id, post.cover_image_id, post.detail_image_id].filter(id => !!id) as string[];
    if (post && imageIds.length > 0) {
        const { data: media } = await supabase
            .from("media")
            .select("*")
            .in("id", imageIds);
        if (media) {
            const featured = media.find(m => m.id === post.featured_image_id);
            const cover = media.find(m => m.id === post.cover_image_id);
            const detail = media.find(m => m.id === post.detail_image_id);
            if (featured) {
                (post as any).featured_image = featured;
                (post as any).imageUrl = featured.url;
                (post as any).image_url = featured.url;
            }
            if (cover) {
                (post as any).cover_image = cover;
                (post as any).coverImageUrl = cover.url;
                (post as any).cover_image_url = cover.url;
            }
            if (detail) {
                (post as any).detail_image = detail;
                (post as any).detailImageUrl = detail.url;
                (post as any).detail_image_url = detail.url;
            }
        }
    }

    return post;
}

export const getAllPosts = cache(unstable_cache(
    async () => {
        const supabase = createStaticClient();
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
                .flatMap(p => [p.featured_image_id, p.cover_image_id, p.detail_image_id])
                .filter((id): id is string => !!id);
            
            if (mediaIds.length > 0) {
                const { data: media } = await supabase
                    .from("media")
                    .select("*")
                    .in("id", mediaIds);
                
                if (media) {
                    return posts.map(post => {
                        const featured_image = media.find(m => m.id === post.featured_image_id);
                        const cover_image = media.find(m => m.id === post.cover_image_id);
                        const detail_image = media.find(m => m.id === post.detail_image_id);
                        return {
                            ...post,
                            featured_image,
                            imageUrl: featured_image?.url,
                            image_url: featured_image?.url,
                            cover_image,
                            coverImageUrl: cover_image?.url,
                            cover_image_url: cover_image?.url,
                            detail_image,
                            detailImageUrl: detail_image?.url,
                            detail_image_url: detail_image?.url,
                        };
                    });
                }
            }
        }

        return posts;
    },
    ["all-posts"],
    { tags: ["posts"] }
));

export const getPublishedPosts = cache(unstable_cache(
    async () => {
        const supabase = createStaticClient();
        const { data: posts, error } = await supabase
            .from("posts")
            .select("*")
            .eq("status", "published")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching published posts:", error);
            return [];
        }

        if (posts && posts.length > 0) {
            const mediaIds = posts
                .flatMap(p => [p.featured_image_id, p.cover_image_id, p.detail_image_id])
                .filter((id): id is string => !!id);
            
            if (mediaIds.length > 0) {
                const { data: media } = await supabase
                    .from("media")
                    .select("*")
                    .in("id", mediaIds);
                
                if (media) {
                    return posts.map(post => {
                        const featured_image = media.find(m => m.id === post.featured_image_id);
                        const cover_image = media.find(m => m.id === post.cover_image_id);
                        const detail_image = media.find(m => m.id === post.detail_image_id);
                        return {
                            ...post,
                            featured_image,
                            imageUrl: featured_image?.url,
                            image_url: featured_image?.url,
                            cover_image,
                            coverImageUrl: cover_image?.url,
                            cover_image_url: cover_image?.url,
                            detail_image,
                            detailImageUrl: detail_image?.url,
                            detail_image_url: detail_image?.url,
                        };
                    });
                }
            }
        }

        return posts;
    },
    ["published-posts"],
    { tags: ["posts"] }
));

export const getPostBySlug = cache(async (slug: string) => {
    return unstable_cache(
        async () => {
            const supabase = createStaticClient();
            
            const { data: post, error } = await supabase
                .from("posts")
                .select("*")
                .eq("slug", slug)
                .eq("status", "published")
                .single();

            if (error) {
                console.error("Error fetching post by slug:", error.message);
                return null;
            }

            const imageIds = [post.featured_image_id, post.cover_image_id, post.detail_image_id].filter(id => !!id) as string[];
            if (post && imageIds.length > 0) {
                const { data: media } = await supabase
                    .from("media")
                    .select("*")
                    .in("id", imageIds);
                if (media) {
                    const featured = media.find(m => m.id === post.featured_image_id);
                    const cover = media.find(m => m.id === post.cover_image_id);
                    const detail = media.find(m => m.id === post.detail_image_id);
                    if (featured) {
                        (post as any).featured_image = featured;
                        (post as any).imageUrl = featured.url;
                        (post as any).image_url = featured.url;
                    }
                    if (cover) {
                        (post as any).cover_image = cover;
                        (post as any).coverImageUrl = cover.url;
                        (post as any).cover_image_url = cover.url;
                    }
                    if (detail) {
                        (post as any).detail_image = detail;
                        (post as any).detailImageUrl = detail.url;
                        (post as any).detail_image_url = detail.url;
                    }
                }
            }

            if (post && post.media_ids && post.media_ids.length > 0) {
                const { data: galleryMedia } = await supabase
                    .from("media")
                    .select("*")
                    .in("id", post.media_ids);
                if (galleryMedia) {
                    (post as any).gallery_media = galleryMedia;
                    (post as any).additionalImages = galleryMedia.map((m: any) => m.url);
                }
            }

            return post;
        },
        [`post-${slug}`],
        { tags: ["posts", `post-${slug}`] }
    )();
});