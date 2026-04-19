"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { createHash } from "crypto";

// Helper to generate an anonymous session fingerprint
async function getSessionFingerprint(allowSetCookie: boolean = false) {
    const headersList = await headers();
    const fallbackIp = "127.0.0.1";
    
    // Getting IP in Next.js App Router
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    const ip = forwardedFor ? forwardedFor.split(',')[0] : (realIp || fallbackIp);
    
    const userAgent = headersList.get("user-agent") || "unknown";
    
    // Use an HttpOnly cookie as a stronger session if available, otherwise fallback to fingerprint
    const cookieStore = await cookies();
    let sessionId = cookieStore.get("interaction_session")?.value;
    
    if (!sessionId) {
        // Hash the IP + UserAgent to create a semi-persistent anonymous ID without storing PII
        const hash = createHash("sha256");
        hash.update(`${ip}-${userAgent}-${process.env.NEXT_PUBLIC_SUPABASE_URL || "salt"}`);
        sessionId = hash.digest("hex");
        
        if (allowSetCookie) {
            try {
                cookieStore.set("interaction_session", sessionId, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 60 * 60 * 24 * 365, // 1 year
                    path: "/",
                });
            } catch (e) {
                console.warn("Could not set cookie, continuing with generated sessionId", e);
            }
        }
    }

    return sessionId;
}

export async function likePost(postId: string) {
    const supabase = await createClient();
    const sessionId = await getSessionFingerprint(true);

    // The UNION of postId and sessionId is enforced unique at the database level by the migration.
    const { error } = await supabase
        .from("post_likes")
        .insert({
            post_id: postId,
            session_id: sessionId
        });

    if (error) {
        // If it's a unique constraint violation, they already liked it
        if (error.code === '23505') { 
            return { success: true, message: "Already liked" };
        }
        console.error("Error liking post:", error);
        return { success: false, error: error.message || "Failed to like post." };
    }

    revalidatePath(`/blog/[slug]`, 'page');
    return { success: true };
}

export async function unlikePost(postId: string) {
    const supabase = await createClient();
    const sessionId = await getSessionFingerprint(true);

    const { error } = await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("session_id", sessionId);

    if (error) {
        console.error("Error unliking post:", error);
        return { success: false, error: error.message || "Failed to unlike post." };
    }

    revalidatePath(`/blog/[slug]`, 'page');
    return { success: true };
}

export async function getLikeCount(postId: string) {
    const supabase = await createClient();
    const sessionId = await getSessionFingerprint();

    const { count, error } = await supabase
        .from("post_likes")
        .select('*', { count: 'exact', head: true })
        .eq("post_id", postId);

    if (error) {
        console.error("Error getting like count:", error);
        return { count: 0, hasLiked: false };
    }

    // Check if current session liked it
    const { data: userLike } = await supabase
        .from("post_likes")
        .select("id")
        .eq("post_id", postId)
        .eq("session_id", sessionId)
        .single();

    return { 
        count: count || 0,
        hasLiked: !!userLike
    };
}

export async function getComments(postId: string) {
    const supabase = await createClient();
    
    const { data: comments, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .eq("is_approved", true)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching comments:", error);
        return [];
    }

    return comments || [];
}

export async function addComment(postId: string, formData: FormData) {
    const supabase = await createClient();
    
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const content = formData.get("content") as string;

    // Basic server-side validation / sanitization
    if (!name || name.trim().length < 2 || name.length > 100) {
        return { success: false, error: "Invalid name." };
    }
    
    if (!content || content.trim().length < 5 || content.length > 2000) {
        return { success: false, error: "Comment must be between 5 and 2000 characters." };
    }

    const { error } = await supabase
        .from("comments")
        .insert({
            post_id: postId,
            author_name: name.trim().replace(/[<>]/g, ""), // basic strip HTML
            author_email: email ? email.trim() : null,
            content: content.trim().replace(/[<>]/g, ""),  // basic strip HTML to prevent simple injection
            is_approved: false // Require admin approval
        });

    if (error) {
        console.error("Error adding comment:", error);
        return { success: false, error: "Failed to post comment." };
    }

    revalidatePath(`/blog/[slug]`, 'page');
    // Note: returning success without inserting to state if it's not approved immediately.
    // The UI should show "Your comment is awaiting moderation."
    return { success: true, message: "Comment submitted and awaiting approval." };
}

// ---------------- Admin Functions ----------------

export async function getAllCommentsAdmin() {
    const supabase = await createClient(); // will need admin privileges or just use anon if RLS allows. Actually, RLS on comments only allows read if is_approved=true OR auth.role() = 'authenticated'. Admin is authenticated.
    
    // Fetch all comments and heavily join the related post title for context
    const { data: comments, error } = await supabase
        .from("comments")
        .select(`
            *,
            post:posts(title)
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching admin comments:", error);
        return [];
    }
    return comments || [];
}

export async function toggleCommentApproval(commentId: string, currentStatus: boolean) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("comments")
        .update({ is_approved: !currentStatus })
        .eq("id", commentId);

    if (error) {
        console.error("Error toggling comment:", error);
        return { success: false, error: error.message };
    }
    revalidatePath("/admin/comments");
    // Also revalidate the blog pages to reflect the change
    revalidatePath("/blog", "layout");
    return { success: true };
}

export async function deleteComment(commentId: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);
        
    if (error) {
        console.error("Error deleting comment:", error);
        return { success: false, error: error.message };
    }
    revalidatePath("/admin/comments");
    revalidatePath("/blog", "layout");
    return { success: true };
}
