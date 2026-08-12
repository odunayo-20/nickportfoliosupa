import type { Metadata } from "next";
import { NotFoundLinks } from "./not-found-links";
import "./main.css";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The page you were looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-brand-light px-6 relative overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Decorative background blobs */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-10rem",
          right: "-10rem",
          width: "40rem",
          height: "40rem",
          background:
            "radial-gradient(circle, rgba(255,184,0,0.12) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-8rem",
          left: "-8rem",
          width: "32rem",
          height: "32rem",
          background:
            "radial-gradient(circle, rgba(42,71,54,0.10) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* 404 number */}
        <p
          style={{
            fontSize: "clamp(6rem, 20vw, 10rem)",
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-0.05em",
            background: "linear-gradient(135deg, #2a4736 0%, #ffb800 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            userSelect: "none",
            animation: "fadeInUp 0.7s cubic-bezier(0.5,0,0,1) both",
          }}
          aria-hidden="true"
        >
          404
        </p>

        {/* Divider line */}
        <div
          style={{
            width: "4rem",
            height: "3px",
            background: "#ffb800",
            borderRadius: "100px",
            margin: "1.5rem 0",
            animation: "fadeInUp 0.7s 0.1s cubic-bezier(0.5,0,0,1) both",
          }}
        />

        {/* Heading */}
        <h1
          style={{
            fontSize: "clamp(1.5rem, 5vw, 2rem)",
            fontWeight: 800,
            color: "#1a1a1a",
            letterSpacing: "-0.03em",
            marginBottom: "1rem",
            animation: "fadeInUp 0.7s 0.15s cubic-bezier(0.5,0,0,1) both",
          }}
        >
          Page not found
        </h1>

        {/* Sub-text */}
        <p
          style={{
            fontSize: "1rem",
            color: "#6b7280",
            lineHeight: 1.7,
            marginBottom: "2.5rem",
            animation: "fadeInUp 0.7s 0.2s cubic-bezier(0.5,0,0,1) both",
          }}
        >
          Looks like this page wandered off. It may have been moved, renamed, or
          never existed in the first place.
        </p>

        <NotFoundLinks />
      </div>

      {/* Inline keyframe styles (main.css fadeInUp is scoped to .reveal class) */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  );
}
