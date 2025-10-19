"use client";
import Controls from "@/components/controls";
import { AppProviders } from "./providers";
import { montserrat } from "@/fonts";
import Nav from "@/components/nav";
import "./globals.css";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  return (
    <html lang="en">
      <body
        className={`${montserrat.className} w-full h-auto scroll-smooth antialiased bg-white text-black dark:bg-black dark:text-white fill-black dark:fill-white`}
      >
        <AppProviders>
          {children}
          {pathname !== "/watch" && <Nav />}
          {pathname !== "/watch" && <Controls />}
        </AppProviders>
      </body>
    </html>
  );
}
