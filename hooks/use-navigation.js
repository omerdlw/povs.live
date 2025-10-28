import { useNavigationContext } from "@/contexts/navigation-context";
import { useEffect, useMemo, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

const SKELETON_ITEM = {
  skeleton: true,
};

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
  const pathname = usePathname();

  const showSkeleton = loadingServers;

  const handleNavigate = useCallback(
    (serverCode) => {
      setActiveServerCode(serverCode);
      setExpanded(false);
    },
    [setActiveServerCode, setExpanded]
  );

  const navigationItems = useMemo(() => {
    if (showSkeleton) {
      return [SKELETON_ITEM];
    }

    return servers.map((server) => ({
      name: server.name.toUpperCase(),
      description: server.description || 'Click to select server',
      icon: server.logo,
      code: server.code,
      playerCount: playerCounts[server.code] || 0
    }));
  }, [servers, showSkeleton]);

  const activeIndex = useMemo(() => {
    if (showSkeleton) return 0;

    const index = navigationItems.findIndex(
      (item) => item.code === activeServerCode
    );
    return Math.max(0, index);
  }, [activeServerCode, navigationItems, showSkeleton]);

  const activeItem = navigationItems[activeIndex];

  const displayItems = useMemo(() => {
    if (pathname === "/" || expanded || isHovered) {
      return navigationItems;
    }
    return activeItem ? [activeItem] : [];
  }, [pathname, expanded, isHovered, navigationItems, activeItem]);

  const activeItemHasAction = useMemo(() => ["/"].includes(pathname));

  return {
    navigationItems: displayItems,
    navigate: handleNavigate,
    activeItemHasAction,
    setIsHovered,
    showSkeleton,
    setExpanded,
    activeIndex,
    expanded,
    pathname,
    playerCounts,
    activeServerCode,
  };
};
