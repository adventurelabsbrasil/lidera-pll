import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PLL - Área de Membros",
    short_name: "PLL",
    description: "Programa Lucro e Liberdade - Área de membros",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      { src: "/favicon.ico", sizes: "48x48", type: "image/x-icon", purpose: "any" },
    ],
  };
}
