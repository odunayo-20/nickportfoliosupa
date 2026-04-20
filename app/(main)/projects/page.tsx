import { getPublishedProjects } from "@/actions/projects";
import ProjectsClient from "./ProjectsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Projects | Senior Software Engineer",
    description: "A collection of high-performance mobile applications, enterprise architectures, and robust web systems I've engineered.",
};

export default async function Projects() {
  const projects = await getPublishedProjects();

  return <ProjectsClient projects={projects} />;
}