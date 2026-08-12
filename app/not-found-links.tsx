"use client";

import Link from "next/link";

export function NotFoundLinks() {
  return (
    <>
      {/* CTA buttons */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          justifyContent: "center",
          animation: "fadeInUp 0.7s 0.25s cubic-bezier(0.5,0,0,1) both",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "#2a4736",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "0.875rem",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            padding: "0.875rem 2rem",
            borderRadius: "100px",
            textDecoration: "none",
            transition: "background-color 0.2s, transform 0.2s",
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
              "#1d3326";
            (e.currentTarget as HTMLAnchorElement).style.transform =
              "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
              "#2a4736";
            (e.currentTarget as HTMLAnchorElement).style.transform =
              "translateY(0)";
          }}
        >
          ← Back Home
        </Link>

        <Link
          href="/contact"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "transparent",
            color: "#2a4736",
            fontWeight: 700,
            fontSize: "0.875rem",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            padding: "0.875rem 2rem",
            borderRadius: "100px",
            textDecoration: "none",
            border: "2px solid #2a4736",
            transition: "background-color 0.2s, color 0.2s, transform 0.2s",
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
              "#2a4736";
            (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff";
            (e.currentTarget as HTMLAnchorElement).style.transform =
              "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
              "transparent";
            (e.currentTarget as HTMLAnchorElement).style.color = "#2a4736";
            (e.currentTarget as HTMLAnchorElement).style.transform =
              "translateY(0)";
          }}
        >
          Contact Me
        </Link>
      </div>

      {/* Quick nav links */}
      <div
        style={{
          marginTop: "3rem",
          display: "flex",
          gap: "1.5rem",
          flexWrap: "wrap",
          justifyContent: "center",
          animation: "fadeInUp 0.7s 0.3s cubic-bezier(0.5,0,0,1) both",
        }}
      >
        {[
          { label: "Projects", href: "/projects" },
          { label: "Blog", href: "/blog" },
          { label: "Services", href: "/services" },
          { label: "About", href: "/about" },
        ].map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            style={{
              fontSize: "0.813rem",
              fontWeight: 600,
              color: "#6b7280",
              textDecoration: "none",
              borderBottom: "1px solid transparent",
              paddingBottom: "2px",
              transition: "color 0.2s, border-color 0.2s",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "#ffb800";
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                "#ffb800";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "#6b7280";
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                "transparent";
            }}
          >
            {label}
          </Link>
        ))}
      </div>
    </>
  );
}
