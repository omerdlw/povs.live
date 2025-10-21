"use client";
import Controls from "@/components/controls";
import { AppProviders } from "./providers";
import { montserrat } from "@/fonts";
import Nav from "@/components/nav";
import "./globals.css";
import { usePathname } from "next/navigation";
import Countdown from "@/components/countdown";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isCountdownActive = false;

  return (
    <html lang="en">
      <body
        className={`${montserrat.className} w-full h-auto scroll-smooth antialiased bg-white text-black dark:bg-black dark:text-white fill-black dark:fill-white`}
      >
        <AppProviders>
          {isCountdownActive ? <Countdown /> : children}
          {pathname !== "/watch" && <Nav />}
          {pathname !== "/watch" && !isCountdownActive && <Controls />}
        </AppProviders>
      </body>
    </html>
  );  
}
