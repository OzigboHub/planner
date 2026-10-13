import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Late Mr. Festus Okoruwa Akhabue (Aged 74) Memorial & Burial Planner",
    short_name: "Pa Festus Memorial",
    description:
      "Official Memorial, Celebration of Life, and Funeral Planning Portal for Late Mr. Festus Okoruwa Akhabue (Aged 74) in Eidenu, Irrua, Edo State.",
    start_url: "/",
    display: "standalone",
    background_color: "#090d16",
    theme_color: "#090d16",
    orientation: "portrait-primary",
    scope: "/",
    lang: "en",
    categories: ["events", "lifestyle", "utilities"],
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
