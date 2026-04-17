import Link from "next/link";

export interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  href: string;
}

export function BlogCard({ title, excerpt, date, readTime, href }: BlogCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <article className="flex h-full flex-col rounded-3xl bg-white/40 backdrop-blur-xl p-6 sm:p-8 border border-zinc-200 dark:border-white/10 transition-all hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-xl hover:bg-zinc-50 dark:hover:bg-white/[0.04]">
        <div className="mb-4 flex items-center text-xs font-medium text-zinc-500 dark:text-zinc-400">
          <time dateTime={date}>{date}</time>
          <span className="mx-3 text-zinc-300 dark:text-zinc-700">•</span>
          <span>{readTime}</span>
        </div>
        <h3 className="mb-3 text-xl font-bold leading-snug tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>
        <p className="flex-1 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          {excerpt}
        </p>
        <div className="mt-6 flex items-center text-sm font-bold text-indigo-600 dark:text-indigo-400 opacity-60 transition-opacity group-hover:opacity-100">
          Read Article
          <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </article>
    </Link>
  );
}
