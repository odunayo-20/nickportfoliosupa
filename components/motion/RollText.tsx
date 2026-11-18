/**
 * Proposal I1 (links) — the label rolls up to an orange copy of itself on hover/focus of the
 * nearest `.roll-host` (or of itself). Server-safe, pure CSS (.roll in main.css).
 */
export function RollText({ children, className = '' }: { children: string; className?: string }) {
  return (
    <span className={`roll ${className}`}>
      <span className="sr-only">{children}</span>
      <span className="roll-inner" aria-hidden="true">
        <span>{children}</span>
        <span>{children}</span>
      </span>
    </span>
  )
}
