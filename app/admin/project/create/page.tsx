import React from "react";
import { ProjectEditor } from "@/components/admin/project/ProjectEditor";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create Project | Nikola",
    description: "Create project for Nikola Portfolio",
};


export default function CreateProjectPage() {
    return <ProjectEditor />;
}