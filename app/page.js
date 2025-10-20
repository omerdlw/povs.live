"use client";

import { useNavigationContext } from "@/contexts/navigation-context";
import { useStreamer } from "@/contexts/streamer-context";
import { useSettings } from "@/contexts/settings-context";
import StreamerCard from "@/components/streamer";
import Background from "@/components/background";
import Icon from "@/components/icon";
import { useMemo } from "react";
import { apiService } from "@/services/apiService";

const sortStreamersBasic = (streamersData, favorites = []) => {
  const streamersArray = Object.values(streamersData).filter(Boolean);
  if (!streamersArray || streamersArray.length === 0) {
    return [];
  }
  return streamersArray.sort((a, b) => {
    if (!a || !b) return 0;

    const isAFavorite = favorites.includes(a.name?.toLowerCase());
    const isBFavorite = favorites.includes(b.name?.toLowerCase());

    if (isAFavorite !== isBFavorite) {
      return isAFavorite ? -1 : 1;
    }

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

export default function HomePage() {
  const { streamersData, loadingStreamers } = useStreamer();
  const { searchQuery } = useNavigationContext();
  const { settings } = useSettings();

  const sortedAndFilteredStreamers = useMemo(() => {
    if (!streamersData || Object.keys(streamersData).length === 0) {
      return [];
    }
    const sorted = sortStreamersBasic(streamersData, settings.favorites || []);

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
  }, [streamersData, searchQuery, settings.favorites]);

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
      <Background />
      {loadingStreamers ? (
        <div className="fixed inset-0 flex justify-center items-center z-10">
          <div className="animate-spin">
            <Icon icon="mingcute:loading-3-fill" size={40} />
          </div>
        </div>
      ) : (
        <div className="w-full h-auto p-5 sm:p-10 pt-10 space-y-8">
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
