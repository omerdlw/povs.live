"use client";

import { useNavigation } from "../../hooks/use-navigation";
import { useState } from "react";
import classNames from "classnames";
import { Card } from "./card";
import { MotionConfig, motion, AnimatePresence } from "framer-motion";
import { ANIMATION_CONFIG } from "./constants";

export default function Nav() {
  const {
    expanded,
    setExpanded,
    activeIndex,
    navigate,
    navigationItems,
    activeItemHasAction,
    setIsHovered,
  } = useNavigation();

  const [actionHeight, setActionHeight] = useState(0);
  const baseCardHeight = 75;

  const containerHeight =
    activeItemHasAction && actionHeight > 0
      ? baseCardHeight + actionHeight + 10
      : baseCardHeight;

  return (
    <MotionConfig transition={ANIMATION_CONFIG.transition}>
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
                />
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}
