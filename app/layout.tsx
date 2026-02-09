import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PWARegister } from "@/components/pwa-register";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "PLL - Área de Membros",
  description: "Programa Lucro e Liberdade - Área de membros",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem("pll-theme");var r=document.documentElement;if(t==="dark")r.classList.add("dark");else if(t==="light")r.classList.remove("dark");else if(window.matchMedia("(prefers-color-scheme: dark)").matches)r.classList.add("dark");else r.classList.remove("dark");})();`,
          }}
        />
        <ThemeProvider>
          <PWARegister />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
