"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "@/services/apiService";

const NavigationContext = createContext(null);
export { NavigationContext };

async function fetchPlayerCount(serverCode) {
  if (!serverCode) return null;
  try {
    const response = await fetch(
      `https://servers-frontend.fivem.net/api/servers/single/${serverCode}`
    );
    if (!response.ok) return 0;
    const data = await response.json();
    return data?.Data?.clients ?? data?.clients ?? 0;
  } catch (error) {
    console.error(`Oyuncu sayısı alınırken hata (${serverCode}):`, error);
    return null;
  }
}

export function NavigationProvider({ children }) {
  const [dynamicNavItem, setDynamicNavItem] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [servers, setServers] = useState([]);
  const [activeServerCode, setActiveServerCode] = useState(null);
  const [loadingServers, setLoadingServers] = useState(true);
  const [playerCounts, setPlayerCounts] = useState({});

  useEffect(() => {
    async function fetchInitialServers() {
      setLoadingServers(true);
      try {
        const savedServerCode =
          typeof window !== "undefined"
            ? localStorage.getItem("selectedServerCode")
            : null;
        const serverList = await apiService.getServers();
        setServers(serverList || []);

        if (serverList && serverList.length > 0) {
          const initialCode =
            savedServerCode &&
            serverList.some((s) => s.code === savedServerCode)
              ? savedServerCode
              : serverList[0].code;
          setActiveServerCode(initialCode);
          if (typeof window !== "undefined") {
            if (
              !localStorage.getItem("selectedServerCode") ||
              !serverList.some((s) => s.code === savedServerCode)
            ) {
              localStorage.setItem("selectedServerCode", initialCode);
            }
          }
        }
      } catch (err) {
        console.error("Sunucular alınamadı:", err);
      } finally {
        setLoadingServers(false);
      }
    }
    fetchInitialServers();
  }, []);

  useEffect(() => {
    if (servers.length === 0) return;

    const fetchAllPlayerCounts = async () => {
      const counts = {};
      await Promise.all(
        servers.map(async (server) => {
          const count = await fetchPlayerCount(server.code);
          if (count !== null) {
            counts[server.code] = count;
          }
        })
      );
      setPlayerCounts((prevCounts) => ({ ...prevCounts, ...counts }));
    };

    fetchAllPlayerCounts();

    const intervalId = setInterval(fetchAllPlayerCounts, 60000);

    return () => clearInterval(intervalId);
  }, [servers]);

  useEffect(() => {
    if (activeServerCode && typeof window !== "undefined") {
      localStorage.setItem("selectedServerCode", activeServerCode);
    }
  }, [activeServerCode]);

  return (
    <NavigationContext.Provider
      value={{
        dynamicNavItem,
        setDynamicNavItem,
        expanded,
        setExpanded,
        searchQuery,
        setSearchQuery,
        servers,
        activeServerCode,
        setActiveServerCode,
        loadingServers,
        playerCounts,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationContext() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error(
      "useNavigationContext must be used within a NavigationProvider"
    );
  }
  return context;
}
