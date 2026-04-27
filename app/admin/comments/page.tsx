import CommentClient from "./CommentClient";
import { Metadata } from "next";
import { getAllCommentsAdmin } from "@/actions/interactions";

export const metadata: Metadata = {
    title: "Comments | Nikola",
    description: "Comments on my blog",
};

export default async function Comments() {
  const comments = await getAllCommentsAdmin();
  return <CommentClient initialData={comments || []} />;
}