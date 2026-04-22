import BlogClient from "./BlogClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog | Nikola",
    description: "Blog about web development and other topics.",
};

export default async function Blog() {
  return <BlogClient />;
}