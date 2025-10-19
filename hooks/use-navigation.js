"use client";
import { useNavigationContext } from "@/contexts/navigation-context";
import { useEffect, useMemo, useState } from "react";

export const useNavigation = () => {
  const {
    expanded,
    setExpanded,
    servers,
    activeServerCode,
    setActiveServerCode,
    loadingServers,
    playerCounts,
  } = useNavigationContext();

  const [isHovered, setIsHovered] = useState(false);
  const showSkeleton = loadingServers;

  const navigationItems = useMemo(() => {
    if (showSkeleton) {
      return [
        {
          code: "loading",
          name: "Yükleniyor...",
          description: "Lütfen bekleyin",
          icon: "eos-icons:loading",
          skeleton: true,
        },
      ];
    }

    return servers.map((server) => {
      const count = playerCounts[server.code];

      const descriptionText =
        typeof count === "number"
          ? `${count} oyuncu aktif`
          : "oyuncu sayısı yükleniyor";

      return {
        ...server,
        name: server.name.toUpperCase() + "Z",
        href: server.code,
        description: descriptionText,
        icon: server.logo ? `${server.name}.png` : "solar:server-2-bold",
      };
    });
  }, [servers, showSkeleton, playerCounts]);

  const activeIndex = useMemo(() => {
    if (showSkeleton || !activeServerCode) return 0;
    const idx = navigationItems.findIndex(
      (item) => item.code === activeServerCode
    );
    return idx >= 0 ? idx : 0;
  }, [activeServerCode, navigationItems, showSkeleton]);

  const navigate = (serverCode) => {
    if (!showSkeleton) {
      setActiveServerCode(serverCode);
      setExpanded(false);
    }
  };

  useEffect(() => {
    if (!expanded) return;
    const handleClickOutside = (e) => {
      if (!document.getElementById("nav-card-stack")?.contains(e.target)) {
        setExpanded(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [expanded, setExpanded]);

  const activeItem = navigationItems[activeIndex];
  const activeItemHasAction =
    !showSkeleton && activeItem?.code === activeServerCode;

  return {
    expanded,
    setExpanded,
    activeIndex,
    navigate,
    navigationItems,
    activeItemHasAction,
    showSkeleton,
    setIsHovered,
  };
};
