import { getPublishedPosts } from "@/actions/blog";
import { getCategories } from "@/actions/categories";
import BlogClient from "./BlogClient";
import { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
    title: "Blog",
    description: "A collection of articles detailing my experiences with architecture, clean code, and scaling systems.",
    alternates: {
        canonical: `${BASE_URL}/blog`,
    },
    openGraph: {
        title: "Blog | My Technical Journal",
        description: "A collection of articles detailing my experiences with architecture, clean code, and scaling systems.",
        type: "website",
        url: `${BASE_URL}/blog`,
    },
    twitter: {
        card: "summary_large_image",
        title: "Blog | My Technical Journal",
        description: "A collection of articles detailing my experiences with architecture, clean code, and scaling systems.",
    },
};

export default async function Blog() {
  const [posts, categories] = await Promise.all([
    getPublishedPosts(),
    getCategories(),
  ]);

  return <BlogClient posts={posts} categories={categories} />;
}