import { getPublishedPosts } from "@/actions/blog";
import BlogClient from "./BlogClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog | My Technical Journal",
    description: "A collection of articles detailing my experiences with architecture, clean code, and scaling systems.",
};

export default async function Blog() {
  const posts = await getPublishedPosts();

  return <BlogClient posts={posts} />;
}