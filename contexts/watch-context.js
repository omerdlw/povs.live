"use client";

import { createContext, useContext, useState } from "react";

const WatchContext = createContext(null); // null ile başlatmak daha iyi
const MAX_STREAMERS = 4;

export function WatchProvider({ children }) {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedStreamers, setSelectedStreamers] = useState([]);

  const toggleSelectionMode = () => {
    if (isSelectionMode) {
      setSelectedStreamers([]);
    }
    setIsSelectionMode(!isSelectionMode);
  };

  const addStreamer = (streamerName) => {
    const lowerCaseName = streamerName.toLowerCase();
    if (
      !selectedStreamers.includes(lowerCaseName) &&
      selectedStreamers.length < MAX_STREAMERS
    ) {
      setSelectedStreamers([...selectedStreamers, lowerCaseName]);
    }
  };

  const removeStreamer = (streamerName) => {
    const lowerCaseName = streamerName.toLowerCase();
    setSelectedStreamers(selectedStreamers.filter((s) => s !== lowerCaseName));
  };

  const value = {
    isSelectionMode,
    selectedStreamers,
    toggleSelectionMode,
    addStreamer,
    removeStreamer,
    maxStreamers: MAX_STREAMERS,
    isMaxStreamersReached: selectedStreamers.length >= MAX_STREAMERS,
  };

  return (
    <WatchContext.Provider value={value}>{children}</WatchContext.Provider>
  );
}

export const useWatch = () => {
  const context = useContext(WatchContext);
  if (!context) {
    throw new Error("useWatch must be used within a WatchProvider");
  }
  return context;
};
