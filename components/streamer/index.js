"use client";

import { useState } from "react";
import { useSettings } from "@/contexts/settings-context";
import StreamerAvatar from "./avatar";
import StreamerStats from "./stats";
import StreamerInfo from "./info";

export default function StreamerCard({ streamer }) {
  const { settings } = useSettings();
  const [isHovered, setIsHovered] = useState(false);

  if (!streamer) return null;

  return (
    <div className="relative flex-auto w-1/4 flex items-center h-auto p-3 border border-black/10 dark:border-white/10 rounded-[30px] bg-white/50 dark:bg-black/20 backdrop-blur-sm transition-all duration-300 overflow-hidden">
      <div className="flex flex-col w-full space-y-3">
        <div className="flex items-center space-x-3 overflow-hidden">
          {settings.largeStreamerCard && streamer.live ? (
            <div
              className="relative w-full aspect-video rounded-[20px] overflow-hidden"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <iframe
                src={`https://player.kick.com/${streamer.name}?autoplay=true&muted=true`}
                allowFullScreen
                height="100%"
                width="100%"
              />
              {isHovered && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md rounded-b-[20px] flex items-center space-x-2 p-1">
                  <StreamerAvatar iframe={true} streamer={streamer} />
                  <StreamerInfo iframe={true} streamer={streamer} />
                </div>
              )}
            </div>
          ) : (
            <>
              <StreamerAvatar streamer={streamer} />
              <div className="flex flex-col w-full">
                <StreamerInfo streamer={streamer} />
              </div>
            </>
          )}
        </div>
        <StreamerStats streamer={streamer} />
      </div>
    </div>
  );
}
