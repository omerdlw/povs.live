"use client";

import { useNavigationContext } from "@/contexts/navigation-context";
import { useStreamer } from "@/contexts/streamer-context";
import { useSettings } from "@/contexts/settings-context";
import StreamerCard from "@/components/streamer";
import Icon from "@/components/icon";
import { StreamerCardSkeleton } from "@/components/shared/skeletons";
import { useEffect, useMemo, useState } from "react";
import { apiService } from "@/services/firebase.service";
import { usePathname } from "next/navigation";

const sortStreamersBasic = (streamersData, favorites = []) => {
  const streamersArray = Object.values(streamersData).filter(Boolean);
  if (!streamersArray || streamersArray.length === 0) {
    return [];
  }

  const favoriteStreamers = [];
  const nonFavoriteStreamers = [];

  streamersArray.forEach((streamer) => {
    if (favorites.includes(streamer.name?.toLowerCase())) {
      favoriteStreamers.push(streamer);
    } else {
      nonFavoriteStreamers.push(streamer);
    }
  });

  // Her grubu kendi içinde sırala
  const sortGroup = (streamers) => {
    return streamers.sort((a, b) => {
      const isLiveA = a.live;
      const isLiveB = b.live;

      if (isLiveA !== isLiveB) {
        return isLiveA ? -1 : 1;
      }

      if (isLiveA && isLiveB) {
        const isGTAVA = a.game?.toLowerCase().includes("gta v");
        const isGTAVB = b.game?.toLowerCase().includes("gta v");

        if (isGTAVA !== isGTAVB) {
          return isGTAVA ? -1 : 1;
        }

        return (b.viewers || 0) - (a.viewers || 0);
      }

      if (!isLiveA && !isLiveB) {
        const dateA = a.lastStreamed ? new Date(a.lastStreamed).getTime() : 0;
        const dateB = b.lastStreamed ? new Date(b.lastStreamed).getTime() : 0;
        return dateB - dateA;
      }

      return 0;
    });
  };

  // Her grubu ayrı ayrı sırala
  const sortedFavorites = sortGroup(favoriteStreamers);
  const sortedNonFavorites = sortGroup(nonFavoriteStreamers);

  // Sıralanmış grupları birleştir
  return [...sortedFavorites, ...sortedNonFavorites];
};

export default function HomePage() {
  const { streamersData, loadingStreamers, favoriteStreamers } = useStreamer();
  const [announcement, setAnnouncement] = useState(null);
  const { searchQuery } = useNavigationContext();
  const { settings } = useSettings();
  const pathname = usePathname();

  useEffect(() => {
    apiService.incrementView("vennyz");
  }, []);

  useEffect(() => {
    let unsubscribe;
    if (!pathname.includes("localhost")) {
      unsubscribe = apiService.watchServerChanges("vennyz", (serverData) => {
        if (serverData && serverData.ANNOUNCEMENT) {
          setAnnouncement(serverData.ANNOUNCEMENT);
        }
      });
    }
    return () => unsubscribe?.();
  }, []);

  const sortedAndFilteredStreamers = useMemo(() => {
    if (!streamersData || Object.keys(streamersData).length === 0) {
      return [];
    }
    const sorted = sortStreamersBasic(streamersData, favoriteStreamers);

    if (!searchQuery) {
      return sorted;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const filtered = sorted.filter((streamer) => {
      if (!streamer) return false;
      const searchTargets = [streamer.title, streamer.name, streamer.game].map(
        (text) => text?.toLowerCase() || ""
      );
      return searchTargets.some((t) => t.includes(lowerQuery));
    });
    return filtered;
  }, [streamersData, searchQuery, favoriteStreamers]);

  const { liveStreamers, offlineStreamers } = useMemo(() => {
    return sortedAndFilteredStreamers.reduce(
      (acc, streamer) => {
        if (streamer.live) {
          acc.liveStreamers.push(streamer);
        } else {
          acc.offlineStreamers.push(streamer);
        }
        return acc;
      },
      { liveStreamers: [], offlineStreamers: [] }
    );
  }, [sortedAndFilteredStreamers]);

  return (
    <>
      {announcement && (
        <div className="bg-white/80 dark:bg-black/40 p-4 flex items-center space-x-4 border-b border-base/10 backdrop-blur-3xl">
          <Icon size={30} icon={"ri:megaphone-fill"} />
          <p>{announcement}</p>
        </div>
      )}
      {loadingStreamers ? (
        <div className="w-full h-auto p-5 sm:p-10 pt-10 space-y-6">
          <div className="flex flex-wrap gap-6">
            {[...Array(60)].map((_, index) => (
              <StreamerCardSkeleton
                key={index}
                isLarge={settings.largeStreamerCard && index < 6}
              />
            ))}
          </div>
          <div className="h-32"></div>
        </div>
      ) : (
        <div className="w-full h-auto p-5 sm:p-10 pt-10 space-y-6">
          {liveStreamers.length > 0 && (
            <div className="flex flex-wrap gap-6">
              {liveStreamers.map((streamer, index) => (
                <StreamerCard key={index} streamer={streamer} index={index} />
              ))}
            </div>
          )}
          {offlineStreamers.length > 0 && (
            <div>
              <div className="flex flex-wrap gap-6">
                {offlineStreamers.map((streamer, index) => (
                  <StreamerCard key={index} streamer={streamer} index={index} />
                ))}
              </div>
            </div>
          )}
          {sortedAndFilteredStreamers.length === 0 && (
            <div className="p-10">
              <p className="text-xl text-center">
                Yayıncı verileri alınamadı veya gösterilecek bir yayıncı yok
              </p>
            </div>
          )}
          <div className="h-32"></div>
        </div>
      )}
    </>
  );
}
