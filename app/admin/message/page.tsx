import MessageClient from "./MessageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Message | Nikola",
    description: "Message for me",
};

export default async function Message() {
  return <MessageClient />;
}