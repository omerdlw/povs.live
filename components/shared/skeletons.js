"use client";

import { CN } from "@/lib/utils";

export function NavCardSkeleton({ className }) {
  return (
    <div
      className={CN(
        "w-[300px] absolute left-1/2 -translate-x-1/2 h-auto cursor-pointer rounded-primary bg-white/80 dark:bg-black/20 border border-base/10 p-3 backdrop-blur-lg",
        className
      )}
    >
      <div className="flex items-center h-auto gap-3 animate-pulse">
        <div className="w-[52px] h-[52px] rounded-primary bg-base/10" />
        <div className="flex-1 flex flex-col gap-1 overflow-hidden">
          <div className="h-4 bg-base/10 rounded-full w-3/4" />
          <div className="h-3 bg-base/10 rounded-full w-1/2 mt-1" />
        </div>
      </div>
    </div>
  );
}
