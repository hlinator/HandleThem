import type { Metadata, Viewport } from "next";
import "./globals.css";
import { DemoProvider } from "@/lib/demo/store";

export const metadata: Metadata = {
  title: { default: "HandleThem – florbal doma", template: "%s | HandleThem" },
  description:
    "Krátké tréninky s hokejkou a neurovizuální minihry pro florbalisty. Každý den jeden krok na cestě k brance.",
};

export const viewport: Viewport = {
  themeColor: "#0a0812",
  width: "device-width",
  initialScale: 1,
};

// Nastaví motiv dřív, než se vykreslí stránka, jinak světlý režim na chvilku problikne tmavým.
const themeScript = `try{var t=localStorage.getItem("ht-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="cs" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh">
        <DemoProvider>{children}</DemoProvider>
      </body>
    </html>
  );
}
