import Link from "next/link";

export interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
  href: string;
  tags: string[];
}

export function ProjectCard({ title, description, imageUrl, href, tags }: ProjectCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xl border border-zinc-200 dark:border-white/10 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl dark:bg-zinc-900/40">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800/50">
        <div className="absolute inset-0 flex items-center justify-center text-zinc-400 dark:text-zinc-500 group-hover:scale-105 transition-transform duration-500">
          <svg className="w-12 h-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 16h16M4 16v-6a2 2 0 012-2h12a2 2 0 012 2v6" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-6 sm:p-8">
        <h3 className="mb-3 text-xl md:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{title}</h3>
        <p className="mb-6 flex-1 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">{description}</p>
        <div className="mb-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="inline-flex items-center rounded-lg bg-zinc-100 dark:bg-white/5 px-3 py-1 text-xs font-semibold tracking-wide text-zinc-800 dark:text-zinc-300">
              {tag}
            </span>
          ))}
        </div>
        <Link href={href} className="inline-flex items-center text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 group/link">
          View Project
          <svg className="ml-2 h-4 w-4 transition-transform group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
