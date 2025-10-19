"use client";

import { useSearchParams } from "next/navigation";
import classNames from "classnames";
import React from "react";

export default function WatchParty() {
  const searchParams = useSearchParams();
  const streamers = searchParams.get("streamers")?.split(",").slice(0, 4) || []; // slice(0, 4) ile limit eklendi

  const gridLayoutClasses =
    {
      1: "grid grid-cols-1 grid-rows-1", // Tek yayıncı tam ekran
      2: "grid grid-cols-2 grid-rows-1", // İki yayıncı yan yana
      3: "grid grid-cols-2 grid-rows-2", // Üç yayıncı (biri büyük, ikisi küçük veya 2x2 gridde bir boşluk) - 2x2 daha kolay
      4: "grid grid-cols-2 grid-rows-2", // Dört yayıncı 2x2 grid
    }[streamers.length] || "grid grid-cols-1 grid-rows-1"; // Varsayılan tek yayıncı

  return (
    <div className={`w-screen h-screen bg-black ${gridLayoutClasses}`}>
      {streamers.map((streamer, index) => (
        <div
          key={streamer}
          className={classNames(
            "w-full h-full overflow-hidden" // Her hücre için temel stil
          )}
        >
          <iframe
            title={`${streamer}'s stream`}
            src={`https://player.kick.com/${streamer}?autoplay=true&muted=true`}
            className="w-full h-full border-none" // Kenarlıkları kaldıralım
            allow="autoplay; fullscreen" // İzinleri güncelleyelim
            allowFullScreen={true}
          ></iframe>
        </div>
      ))}
      {streamers.length === 3 && (
        <div className="w-full h-full bg-black/50 center text-gray-500">
          Boş Slot
        </div>
      )}
    </div>
  );
}
