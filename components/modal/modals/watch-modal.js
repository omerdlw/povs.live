"use client";

import { useStreamer } from "@/contexts/streamer-context";
import { useModal } from "@/contexts/modal-context";
import { useWatch } from "@/contexts/watch-context";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Title from "../title";

export default function WatchModal() {
  const { streamersData, loadingStreamers } = useStreamer();
  const {
    isMaxStreamersReached,
    selectedStreamers,
    removeStreamer,
    maxStreamers,
    addStreamer,
  } = useWatch();
  const { closeModal } = useModal();
  const router = useRouter();

  if (loadingStreamers) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  const liveStreamers = Object.entries(streamersData)
    .map(([key, data]) => ({
      id: key,
      ...data,
    }))
    .filter((streamer) => streamer.live);

  if (liveStreamers.length === 0) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[300px]">
        <h2 className="text-xl font-bold text-white mb-2">
          Aktif Yayıncı Bulunamadı
        </h2>
        <p className="text-gray-400 text-sm text-center">
          Şu anda yayında olan yayıncı bulunmuyor. Lütfen daha sonra tekrar
          deneyin.
        </p>
      </div>
    );
  }

  return (
    <>
      <Title
        description={`En fazla ${maxStreamers} adet yayıncı seçme hakkınız bulunmakta`}
        title="İzlemek istediğin yayıncıları seç"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {liveStreamers.map((streamer) => {
          const isSelected = selectedStreamers.includes(
            streamer.name.toLowerCase()
          );
          const isDisabled = isMaxStreamersReached && !isSelected;

          return (
            <button
              key={streamer.id}
              onClick={() => {
                if (isSelected) {
                  removeStreamer(streamer.name);
                } else if (!isMaxStreamersReached) {
                  addStreamer(streamer.name);
                }
              }}
              disabled={isDisabled}
              className={cn(
                "p-4 bg-black/5 dark:bg-white/5 cursor-pointer rounded-[20px] border transition-all duration-200",
                "flex items-center space-x-3",
                isSelected
                  ? "border-purple-700 dark:border-purple-500"
                  : "border-transparent",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <img
                src={streamer.avatar}
                alt={streamer.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 text-left">
                <h3 className="font-semibold uppercase">{streamer.name}</h3>
                <p className="text-sm text-purple-700 dark:text-purple-500">
                  {streamer.viewers} izleyici
                </p>
              </div>
              {isSelected && (
                <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-3 h-3"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-end p-4 border-t border-black/10 dark:border-white/10">
        <button
          onClick={() => {
            if (selectedStreamers.length === 0) return;
            const query = selectedStreamers.join(",");
            router.push(`/watch?streamers=${query}`);
            closeModal();
          }}
          disabled={selectedStreamers.length === 0}
          className={cn(
            "w-full p-4 rounded-[20px] cursor-pointer font-medium transition-colors",
            selectedStreamers.length === 0
              ? "bg-black/10 dark:bg-white/10 cursor-not-allowed"
              : "bg-purple-700 dark:bg-purple-500 text-white"
          )}
        >
          İzle ({selectedStreamers.length})
        </button>
      </div>
    </>
  );
}
