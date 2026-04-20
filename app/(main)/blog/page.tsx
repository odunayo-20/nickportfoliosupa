import { getPublishedPosts } from "@/actions/blog";
import { getCategories } from "@/actions/categories";
import BlogClient from "./BlogClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog | My Technical Journal",
    description: "A collection of articles detailing my experiences with architecture, clean code, and scaling systems.",
};

export default async function Blog() {
  const [posts, categories] = await Promise.all([
    getPublishedPosts(),
    getCategories(),
  ]);

  return <BlogClient posts={posts} categories={categories} />;
}