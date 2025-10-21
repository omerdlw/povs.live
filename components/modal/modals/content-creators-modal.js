"use client";

import { youtubers } from "@/data/youtubers";
import { useState, useEffect } from "react";
import Icon from "@/components/icon";
import Title from "../title";

export default function ContentCreatorsModal({ close, data }) {
  const [creatorsData, setCreatorsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/youtube-creators?channels=${youtubers.join(",")}`
        );
        if (!response.ok) {
          throw new Error(`Veri çekilemedi: ${response.statusText}`);
        }
        const result = await response.json();
        if (result.error) {
          throw new Error(result.error);
        }
        setCreatorsData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-[450px] h-full flex flex-col">
      <Title title="İçerik Üreticileri" />
      <div className="flex-1 overflow-y-auto space-y-4">
        {loading && (
          <div className="w-full h-full center">
            <div className="animate-spin">
              <Icon icon="mingcute:loading-3-fill" size={32} />
            </div>
          </div>
        )}
        {error && (
          <div className="w-full h-full center">
            <p className="text-red-500 dark:text-red-400">Hata: {error}</p>
          </div>
        )}
        {!loading && !error && creatorsData.length === 0 && (
          <div className="w-full h-full center">
            <p className="opacity-70">İçerik üreticisi bulunamadı.</p>
          </div>
        )}
        {!loading &&
          !error &&
          creatorsData.map((creator, index) => (
            <div
              key={index}
              className="w-full border-b border-black/10 dark:border-white/10 p-4"
            >
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={creator.channelAvatar}
                  alt={creator.channelName}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <a
                    href={creator.channelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-lg hover:underline"
                  >
                    {creator.channelName}
                  </a>
                  <p className="text-sm opacity-70">
                    {creator.subscriberCount} Abone
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {creator.videos?.map((video, vIndex) => (
                  <a
                    key={vIndex}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-2 rounded-[20px] bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-24 h-14 rounded-[10px] object-cover"
                    />
                    <div className="flex-1 overflow-hidden">
                      <p className="font-medium truncate" title={video.title}>
                        {video.title}
                      </p>
                      <p className="text-sm opacity-60">
                        {video.views} görüntülenme · {video.publishedAt}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
