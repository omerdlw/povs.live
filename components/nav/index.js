"use client";

import { MotionConfig, motion, AnimatePresence } from "framer-motion";
import { useNavigation } from "@/hooks/use-navigation";
import { NAV_ANIMATION_CONFIG } from "@/config/constants";
import { useState } from "react";
import classNames from "classnames";
import Card from "./card";
import { useNavigationContext } from "@/contexts/navigation-context";

export default function Nav() {
  const {
    expanded,
    setExpanded,
    activeIndex,
    navigate,
    navigationItems,
    activeItemHasAction,
    setIsHovered,
    playerCounts,
    activeServerCode,
  } = useNavigation();

  const { loadingServers } = useNavigationContext();
  const [actionHeight, setActionHeight] = useState(0);
  const baseCardHeight = 75;

  const containerHeight =
    activeItemHasAction && actionHeight > 0
      ? baseCardHeight + actionHeight + 10
      : baseCardHeight;

  return (
    <MotionConfig transition={NAV_ANIMATION_CONFIG.transition}>
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="fixed inset-0 backdrop-blur-lg z-40 cursor-pointer"
            onClick={() => setExpanded(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="fixed w-screen h-screen inset-0 -z-10 dark:bg-gradient-to-t dark:from-black dark:via-black/40 dark:to-black/50 bg-gradient-to-t from-white via-white/40 to-white/50"></div>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className={classNames(
          "fixed bottom-4 left-1/2 -translate-x-2/4 w-[300px] mx-auto z-50 select-none"
        )}
        id="nav-card-stack"
      >
        <div
          className="relative"
          style={{
            height: `${containerHeight}px`,
            transition: "height 300ms ease-in-out",
          }}
        >
          <AnimatePresence mode="popLayout">
            {navigationItems.map((item, i) => {
              const position =
                (i - activeIndex + navigationItems.length) %
                navigationItems.length;
              const isTop = position === 0;

              return (
                <Card
                  loadingServers={loadingServers}
                  onClick={() =>
                    !item.skeleton &&
                    (expanded
                      ? navigate(item.code)
                      : isTop && setExpanded(true))
                  }
                  onActionHeightChange={isTop ? setActionHeight : null}
                  onMouseEnter={() => isTop && setIsHovered(true)}
                  onMouseLeave={() => isTop && setIsHovered(false)}
                  expanded={expanded}
                  position={position}
                  key={item.code || `skeleton-${i}`}
                  isTop={isTop}
                  link={item}
                  playerCount={
                    !item.skeleton ? playerCounts[item.code] : undefined
                  }
                  isActive={!item.skeleton && item.code === activeServerCode}
                />
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}
