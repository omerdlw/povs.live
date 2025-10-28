"use client";

import { CN } from "@/lib/utils";

export function StreamerCardSkeleton({ isLarge }) {
  return (
    <div className="relative flex-auto w-1/4 flex items-center h-auto p-3 border border-base/10 rounded-primary bg-white/50 dark:bg-black/40 backdrop-blur-sm transition-all duration-300 overflow-hidden">
      <div className="flex flex-col w-full space-y-3">
        <div className="flex items-center space-x-3 overflow-hidden">
          {isLarge ? (
            <div className="relative w-full aspect-video rounded-secondary overflow-hidden bg-base/10 animate-pulse">
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md rounded-b-secondary p-2 flex items-center space-x-2">
                <div className="relative">
                  <div className="w-[52px] h-[52px] rounded-secondary bg-base/10" />
                </div>
                <div className="flex flex-col w-full gap-1">
                  <div className="h-4 bg-base/10 rounded-full w-3/4" />
                  <div className="h-3 bg-base/10 rounded-full w-1/2" />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="relative animate-pulse">
                <div className="w-[52px] h-[52px] rounded-secondary bg-base/10" />
              </div>
              <div className="flex flex-col w-full gap-1 animate-pulse">
                <div className="h-4 bg-base/10 rounded-full w-3/4" />
                <div className="h-3 bg-base/10 rounded-full w-1/2" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

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
