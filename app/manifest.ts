import type { MetadataRoute } from "next";

/**
 * Web App Manifest — helps browsers and Google understand the site as a PWA.
 * Improves mobile discoverability and can appear as an "Add to Home Screen" option.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nikola Srdoc — Portfolio",
    short_name: "Nikola",
    description:
      "Nikola Srdoc's portfolio — projects, blog, and professional services.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    orientation: "portrait",
    icons: [
      {
        src: "/logo.png",
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
