"use client";

import classNames from "classnames";
import React from "react";
import Icon from "@/components/icon";
import { useRouter } from "next/navigation";

export default function WatchGrid({ streamers }) {
  const router = useRouter();
  const gridLayoutClasses =
    {
      1: "grid-cols-1 grid-rows-1", // Tek yayıncı tam ekran
      2: "grid-cols-2 grid-rows-1", // İki yayıncı yan yana
      3: "grid-cols-3 grid-rows-1", // Üç yayıncı
      4: "grid-cols-2 grid-rows-2", // Dört yayıncı 2x2 grid
    }[streamers.length] || "grid-cols-1 grid-rows-1";

  return (
    <div className="fixed inset-0 w-full h-full bg-black">
      <div className={`w-full h-full grid gap-1 ${gridLayoutClasses}`}>
        {streamers.map((streamer) => (
          <div
            key={streamer}
            className={classNames(
              "w-full h-full relative overflow-hidden bg-zinc-900"
            )}
          >
            <iframe
              title={`${streamer}'s stream`}
              src={`https://player.kick.com/${streamer}?autoplay=true&muted=true`}
              className="absolute inset-0 w-full h-full border-0"
              allow="autoplay; fullscreen"
              allowFullScreen={true}
            ></iframe>
          </div>
        ))}
      </div>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => router.back()}
          className="size-14 center cursor-pointer rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md border border-base/10 transition-colors"
        >
          <Icon icon="solar:rewind-back-circle-bold" size={28} />
        </button>
      </div>
    </div>
  );
}