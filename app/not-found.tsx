import type { Metadata } from "next";
import { NotFoundLinks, NotFoundVisual } from "./not-found-links";
import "./main.css";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The page you were looking for doesn't exist.",
};

/**
 * Phase 4 — 404 page. Rendered outside the (main) layout, so it adds `.site-root` + <SiteMarker/> (html.site) itself to
 * pick up the light/dark theme tokens.
 */
export default function NotFound() {
  return (
    <div className="site-root min-h-screen flex flex-col items-center justify-center bg-surface text-ink px-6 relative overflow-hidden isolate">
      <NotFoundVisual />

      <div className="relative z-10 flex flex-col items-center text-center max-w-xl">
        <NotFoundLinks />
      </div>
    </div>
  );
}
