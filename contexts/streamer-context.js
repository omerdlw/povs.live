"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { streamerService } from "@/services/streamerService";
import { useNavigationContext } from "./navigation-context";
import { apiService } from "@/services/apiService";

const StreamerContext = createContext(null);

export function StreamerProvider({ children }) {
  const { activeServerCode, servers } = useNavigationContext();
  const [streamerUsernames, setStreamerUsernames] = useState([]);
  const [streamersData, setStreamersData] = useState({});
  const [loadingStreamers, setLoadingStreamers] = useState(true);
  const [serverDetails, setServerDetails] = useState(null);

  useEffect(() => {
    async function fetchServerData() {
      const activeServer = servers.find((s) => s.code === activeServerCode);
      const serverNameToFetch = activeServer?.name;

      if (!serverNameToFetch) {
        setStreamerUsernames([]);
        setServerDetails(null);
        if (activeServerCode) {
          setLoadingStreamers(true);
        } else {
          setLoadingStreamers(false);
        }
        return;
      }

      if (serverDetails?.NAME === serverNameToFetch && !loadingStreamers)
        return;

      setLoadingStreamers(true);
      setStreamersData({});
      try {
        const details = await apiService.getServerDetails(serverNameToFetch);
        setServerDetails(details);
        const kickUsernames =
          details?.STREAMERS?.filter(
            (username) => typeof username === "string" && username.trim() !== ""
          ) || [];
        setStreamerUsernames(kickUsernames); // Bu, aşağıdaki useEffect'i tetikleyecek

        if (kickUsernames.length === 0) {
          setLoadingStreamers(false);
        }
      } catch (error) {
        console.error(
          `StreamerContext: Sunucu detayları alınırken hata (${serverNameToFetch}):`,
          error
        );
        setStreamerUsernames([]);
        setServerDetails(null);
        setLoadingStreamers(false); // Hata durumunda yüklemeyi bitir
      }
    }

    if (servers && servers.length > 0 && activeServerCode) {
      fetchServerData();
    } else if (!activeServerCode && servers && servers.length > 0) {
      setLoadingStreamers(false);
    } else if (!servers || servers.length === 0) {
      setLoadingStreamers(true);
    }
  }, [activeServerCode, servers]);

  useEffect(() => {
    async function fetchStreamerDetails() {
      if (streamerUsernames.length === 0) {
        setStreamersData({}); // Veriyi temizle
        return;
      }

      try {
        const data = await streamerService.getMultipleStreamersInfo(
          streamerUsernames
        );
        setStreamersData(data || {});
      } catch (error) {
        console.error(
          "StreamerContext: Yayıncı detayları alınırken hata:",
          error
        );
        setStreamersData({});
      } finally {
        setLoadingStreamers(false);
      }
    }

    if (streamerUsernames.length > 0) {
      fetchStreamerDetails();
    } else {
    }
  }, [streamerUsernames]); // Bağımlılık sadece streamerUsernames olmalı

  const value = {
    streamersData,
    loadingStreamers,
    serverDetails,
  };

  return (
    <StreamerContext.Provider value={value}>
      {children}
    </StreamerContext.Provider>
  );
}

export const useStreamer = () => {
  const context = useContext(StreamerContext);
  if (!context) {
    throw new Error("useStreamer must be used within a StreamerProvider");
  }
  return context;
};
