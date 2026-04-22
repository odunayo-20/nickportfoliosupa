import CommentClient from "./CommentClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Comments | Nikola",
    description: "Comments on my blog",
};

export default async function Comments() {
  return <CommentClient />;
}