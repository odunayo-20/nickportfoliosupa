import React from "react";
import { ProjectEditor } from "@/components/admin/project/ProjectEditor";
import { AlertCircle } from "lucide-react";
import { getProjectById } from "@/actions/projects";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = await getProjectById(id);

    if (project === null) {
        return (
            <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center mb-6 text-red-500">
                    <AlertCircle size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Project Not Found</h2>
                <p className="text-slate-500 font-medium text-sm mt-2">The project you're looking for doesn't exist or has been removed.</p>
                <div className="mt-8">
                    <a 
                        href="/admin/project"
                        className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
                    >
                        Back to Projects
                    </a>
                </div>
            </div>
        );
    }

    return <ProjectEditor initialData={project} id={id} />;
}
