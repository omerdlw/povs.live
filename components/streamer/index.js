"use client";

import { useState } from "react";
import { useSettings } from "@/contexts/settings-context";
import { useStreamer } from "@/contexts/streamer-context";
import StreamerAvatar from "./avatar";
import StreamerStats from "./stats";
import StreamerInfo from "./info";
import Icon from "../icon";

export default function StreamerCard({ streamer }) {
  const { settings } = useSettings();
  const { favoriteStreamers, toggleFavorite } = useStreamer();
  const [isHovered, setIsHovered] = useState(false);

  if (!streamer) return null;

  const isFavorite = favoriteStreamers.includes(streamer.name?.toLowerCase());

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(streamer.name?.toLowerCase());
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex-auto w-1/4 flex items-center h-auto p-3 border border-base/10 rounded-primary bg-white/50 dark:bg-black/40 backdrop-blur-sm transition-all duration-300 overflow-hidden"
    >
      <div className="flex flex-col w-full space-y-3">
        <div className="flex items-center space-x-3 overflow-hidden">
          {settings.largeStreamerCard && streamer.live ? (
            <div className="relative w-full aspect-video rounded-secondary overflow-hidden">
              <iframe
                src={`https://player.kick.com/${streamer.name}?autoplay=true&muted=true`}
                allowFullScreen
                height="100%"
                width="100%"
              />
              {isHovered && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md rounded-b-secondary p-2 flex items-center space-x-2">
                  <StreamerAvatar
                    handleFavoriteClick={handleFavoriteClick}
                    isFavorite={isFavorite}
                    isHovered={isHovered}
                    streamer={streamer}
                  />
                  <StreamerInfo iframe={true} streamer={streamer} />
                </div>
              )}
            </div>
          ) : (
            <>
              <StreamerAvatar
                handleFavoriteClick={handleFavoriteClick}
                isFavorite={isFavorite}
                isHovered={isHovered}
                streamer={streamer}
              />
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
