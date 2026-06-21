import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sanatan Knowledge Archive",
    short_name: "Sanatan Archive",
    description: "Immersive digital library for Vedas and Mahapuranas.",
    start_url: "/",
    display: "standalone",
    background_color: "#06070f",
    theme_color: "#ab8440",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
