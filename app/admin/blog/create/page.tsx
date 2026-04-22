import { BlogEditor } from "@/components/admin/blog/BlogEditor";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create Blog | Nikola",
    description: "Create blog for me",
};


export default function CreateBlogPostPage() {
    return <BlogEditor isEditing={false} />;
}