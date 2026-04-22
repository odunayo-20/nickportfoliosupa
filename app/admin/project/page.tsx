import ProjectClient from "./ProductClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Project | Nikola",
    description: "Project for me",
};

export default async function Project() {
  return <ProjectClient />;
}