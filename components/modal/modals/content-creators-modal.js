"use client";

import { youtubers } from "@/data/youtubers";
import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/icon";
import Title from "../title";

export default function ContentCreatorsModal({ close }) {
  const [creatorsData, setCreatorsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/youtube-creators`, {
        cache: "no-store",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      const result = await res.json();
      setCreatorsData(result || []);
    } catch (err) {
      console.error("YouTube API Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="w-[450px] h-full flex flex-col max-h-[80vh]">
      <Title title="İçerik Üreticileri" />

      <div className="flex-1 overflow-y-auto space-y-4 p-1">
        {loading && (
          <div className="w-full h-40 flex items-center justify-center">
            <div className="animate-spin">
              <Icon icon="mingcute:loading-3-fill" size={32} />
            </div>
          </div>
        )}

        {error && (
          <div className="w-full h-40 flex flex-col items-center justify-center space-y-3">
            <Icon icon="mdi:alert-circle" size={32} className="text-red-500" />
            <p className="text-red-500 dark:text-red-400 text-center px-4">
              {error}
            </p>
            <button
              onClick={loadData}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Yeniden Dene
            </button>
          </div>
        )}

        {!loading && !error && creatorsData.length === 0 && (
          <div className="w-full h-40 flex items-center justify-center">
            <p className="opacity-70">İçerik üreticisi bulunamadı.</p>
          </div>
        )}

        {!loading &&
          !error &&
          creatorsData.map((creator, index) => (
            <div
              key={creator.id || index}
              className="w-full border-b border-base/10 pb-4 last:border-0"
            >
              {/* Kanal Başlığı */}
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={creator.channelAvatar}
                  alt={creator.channelName}
                  className="w-12 h-12 rounded-full object-cover bg-gray-200 dark:bg-gray-700"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/48?text=?";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <a
                    href={creator.channelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-base hover:underline block truncate"
                    title={creator.channelName}
                  >
                    {creator.channelName}
                  </a>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm opacity-70">
                      {creator.subscriberCount} Abone
                    </p>
                    {creator.error && (
                      <Icon
                        icon="mdi:alert-circle-outline"
                        size={16}
                        className="text-orange-500"
                        title={creator.error}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Videolar */}
              {creator.videos && creator.videos.length > 0 && (
                <div className="space-y-2">
                  {creator.videos.map((video, vIndex) => (
                    <a
                      key={vIndex}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-2 rounded-xl bg-base/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors group"
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-20 h-11 rounded-lg object-cover bg-gray-200 dark:bg-gray-700 flex-shrink-0"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/160x90?text=Video";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                          title={video.title}
                        >
                          {video.title}
                        </p>
                        <p className="text-xs opacity-60 mt-1">
                          {video.views} görüntülenme • {video.publishedAt}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {(!creator.videos || creator.videos.length === 0) &&
                !creator.error && (
                  <p className="text-sm opacity-50 italic">Video bulunamadı</p>
                )}
            </div>
          ))}
      </div>
    </div>
  );
}
