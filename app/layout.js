"use client";
import Controls from "@/components/controls";
import { AppProviders } from "./providers";
import { montserrat } from "@/fonts";
import Nav from "@/components/nav";
import "./globals.css";
import { usePathname } from "next/navigation";
import Countdown from "@/components/countdown";
import Background from "@/components/background";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isCountdownActive = false;

  const metadata = {
    title: "POVS",
    description: "kick.com povs",
  };

  return (
    <html lang="en">
      <body
        className={`${montserrat.className} w-full h-auto scroll-smooth antialiased bg-white dark:bg-black text-black dark:text-white fill-black dark:fill-white`}
      >
        <AppProviders>
          <Background />
          {isCountdownActive ? <Countdown /> : children}
          {pathname !== "/watch" && pathname !== "/panel" && <Nav />}
          {pathname !== "/watch" && !isCountdownActive && <Controls />}
        </AppProviders>
      </body>
    </html>
  );
}
