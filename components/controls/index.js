"use client";

import { useModal } from "@/contexts/modal-context";
import { usePathname, useRouter } from "next/navigation";
import { useWatch } from "@/contexts/watch-context";
import { useStreamer } from "@/contexts/streamer-context";
import ControlsButton from "./button";
import React from "react";
import ServerControls from "./views/server-controls";

export default function Controls() {
  const { openModal } = useModal();
  const pathname = usePathname();

  return (
    <div className="fixed left-0 right-0 bottom-0 w-full h-[100px] flex items-center justify-between z-30 select-none pointer-events-none">
      {pathname === "/" && <ServerControls />}
    </div>
  );
}
