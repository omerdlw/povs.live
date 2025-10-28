import { useMemo, useState, useEffect, useLayoutEffect } from "react";
import { useComponentSize } from "@/hooks/use-component-size";
import { NAV_ANIMATION_CONFIG } from "@/config/constants";
import { NavCardSkeleton } from "../shared/skeletons";
import { Description, Title, Icon } from "./elements";
import SearchAction from "./actions/search-action";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import PollAction from "./actions/poll-action";

export default function Card({
  onActionHeightChange,
  isStackHovered,
  loadingServers,
  onMouseEnter,
  onMouseLeave,
  position,
  expanded,
  onClick,
  isTop,
  link,
  playerCount,
  isActive,
}) {
  const { offsetY: expandedOffsetY } = NAV_ANIMATION_CONFIG.expanded;
  const { offsetY: collapsedOffsetY, scale: collapsedScale } =
    NAV_ANIMATION_CONFIG.collapsed;
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [isIndividualHovered, setIsIndividualHovered] = useState(false);
  const [actionRef, actionSize] = useComponentSize();

  const ActionComponent = isTop ? (
    <>
      <SearchAction placeholder={"search in streamers"} />
      <PollAction />
    </>
  ) : null;

  useLayoutEffect(() => {
    if (isTop && onActionHeightChange) {
      if (ActionComponent && actionSize.height > 0) {
        requestAnimationFrame(() => onActionHeightChange(actionSize.height));
      }
    }
  }, [isTop, ActionComponent, actionSize.height, onActionHeightChange]);

  if (loadingServers) {
    return (
      <motion.div
        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
        className="absolute left-1/2 -translate-x-1/2 w-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          zIndex: NAV_ANIMATION_CONFIG.expanded.scale - position,
          scale: Math.pow(collapsedScale, position),
          y: position * collapsedOffsetY,
          opacity: 1,
        }}
      >
        <NavCardSkeleton />
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`absolute left-1/2 -translate-x-1/2 w-full h-auto cursor-pointer rounded-primary bg-white/80 dark:bg-black/40 backdrop-blur-lg border p-3 transition-colors duration-200 ease-linear transform-gpu will-change-transform ${
        expanded
          ? isIndividualHovered
            ? "border-primary"
            : "border-base/10"
          : isStackHovered
          ? "border-primary"
          : "border-base/10"
      }`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        y: expanded ? position * expandedOffsetY : position * collapsedOffsetY,
        scale: expanded ? 1 : Math.pow(collapsedScale, position),
        zIndex: NAV_ANIMATION_CONFIG.expanded.scale - position,
      }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      transition={{
        y: {
          ...NAV_ANIMATION_CONFIG.transition,
          delay: expanded ? position * 0.04 : 0,
        },
        scale: {
          ...NAV_ANIMATION_CONFIG.transition,
          delay: expanded ? position * 0.02 : 0,
        },
      }}
      onClick={onClick}
      onMouseEnter={() => {
        setIsIndividualHovered(true);
        setIsHovered(true);
        onMouseEnter?.();
      }}
      onMouseLeave={() => {
        setIsIndividualHovered(false);
        setIsHovered(false);
        onMouseLeave?.();
      }}
      layout
    >
      <div className="flex items-center h-auto gap-3">
        <Icon icon={link.icon} isActive={isActive} />
        <div className="flex-1 flex flex-col -gap-1 overflow-hidden">
          <Title text={link.name} isActive={isActive} />
          <Description
            text={
              isHovered && !expanded
                ? "Click to select server"
                : `${link.playerCount} aktif oyuncu`
            }
            isActive={isActive}
          />
        </div>
      </div>
      {ActionComponent && <div ref={actionRef}>{ActionComponent}</div>}
    </motion.div>
  );
}
