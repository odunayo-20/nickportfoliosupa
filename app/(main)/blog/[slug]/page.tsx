import { getPostBySlug, getPublishedPosts } from "@/actions/blog";
import { getComments, getLikeCount } from "@/actions/interactions";
import BlogPostClient from "./BlogPostClient";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const post = await getPostBySlug(resolvedParams.slug);

    if (!post) {
        return {
            title: "Post Not Found | My Technical Journal",
        };
    }

    return {
        title: `${post.title} | My Technical Journal`,
        description: post.excerpt || `Read ${post.title} on my technical journal.`,
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    
    // Fetch user profile info along with the post
    const post = await getPostBySlug(resolvedParams.slug);
    
    // Fetch related posts (could be refined to fetch by category or tags later)
    const allPublished = await getPublishedPosts();
    const relatedPosts = allPublished.filter(p => p.id !== post?.id).slice(0, 2);

    let comments = [];
    let likesData = { count: 0, hasLiked: false };

    if (post) {
        // Fetch interactons concurrently
        const [fetchedComments, fetchedLikes] = await Promise.all([
            getComments(post.id),
            getLikeCount(post.id)
        ]);
        comments = fetchedComments;
        likesData = fetchedLikes;
    }

    return <BlogPostClient post={post} relatedPosts={relatedPosts} initialComments={comments} initialLikes={likesData} />;
}