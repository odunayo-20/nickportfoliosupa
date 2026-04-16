import React from "react";
import { BlogEditor } from "@/components/admin/blog/BlogEditor";
import { getPostById } from "@/actions/blog";
import { notFound } from "next/navigation";

interface EditBlogPostPageProps {
    params: {
        id: string;
    };
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
    const { id } = await params;
    const post = await getPostById(id);

    if (!post) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center">
                <h2 className="text-2xl font-bold">Post not found</h2>
                <p className="text-muted-foreground mt-2">The blog post you are trying to edit does not exist or has been removed.</p>
            </div>
        );
    }

    return <BlogEditor initialData={post} isEditing={true} />;
}
