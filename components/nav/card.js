import { useComponentSize } from "@/hooks/use-component-size";
import { useMemo, useState, useEffect } from "react";
import { Description } from "./card/description";
import { ANIMATION_CONFIG } from "./constants";
import { SkeletonCard } from "./card/skeleton";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Title } from "./card/title";
import { Icon } from "./card/icon";
import dynamic from "next/dynamic";
import SearchAction from "./card/actions/search-action";
import CountdownAction from "./card/actions/countdown-action";

function CardComponent({
  link,
  position,
  expanded,
  onClick,
  isTop,
  onActionHeightChange,
  onMouseEnter,
  onMouseLeave,
}) {
  const { offsetY: expandedOffsetY } = ANIMATION_CONFIG.expanded;
  const { offsetY: collapsedOffsetY, scale: collapsedScale } =
    ANIMATION_CONFIG.collapsed;
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [actionRef, actionSize] = useComponentSize();
  const isCountdownActive = false;

  const ActionComponent = isTop ? (
    isCountdownActive ? (
      <CountdownAction />
    ) : (
      <SearchAction />
    )
  ) : null;

  useEffect(() => {
    if (isTop && onActionHeightChange) {
      onActionHeightChange(actionSize.height);
    }
  }, [actionSize.height, isTop, onActionHeightChange]);

  if (link.skeleton) {
    return (
      <motion.div
        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
        className="absolute left-1/2 -translate-x-1/2 w-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          zIndex: ANIMATION_CONFIG.expanded.scale - position,
          scale: Math.pow(collapsedScale, position),
          y: position * collapsedOffsetY,
          opacity: 1,
        }}
      >
        <SkeletonCard />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 w-full h-auto cursor-pointer rounded-[30px] bg-white/80 dark:bg-black/40 backdrop-blur-lg border-2 border-black/10 dark:border-white/10 p-3 transform-gpu will-change-transform"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        y: expanded ? position * expandedOffsetY : position * collapsedOffsetY,
        scale: expanded ? 1 : Math.pow(collapsedScale, position),
        zIndex: ANIMATION_CONFIG.expanded.scale - position,
      }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      transition={{
        y: {
          ...ANIMATION_CONFIG.transition,
          delay: expanded ? position * 0.04 : 0,
        },
        scale: {
          ...ANIMATION_CONFIG.transition,
          delay: expanded ? position * 0.02 : 0,
        },
      }}
      onClick={onClick}
      onMouseEnter={() => {
        setIsHovered(true);
        onMouseEnter?.();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onMouseLeave?.();
      }}
      layout
    >
      <div className="flex items-center h-auto gap-3">
        <Icon icon={link.logo} />
        <div className="flex-1 flex flex-col -space-y-1 overflow-hidden">
          <Title text={link.name} />
          <Description
            text={
              isHovered && !expanded
                ? "click to see the servers"
                : link.description
            }
          />
        </div>
      </div>
      {ActionComponent && (
        <div ref={actionRef} className="mt-2.5">
          {ActionComponent}
        </div>
      )}
    </motion.div>
  );
}

const Card = dynamic(() => Promise.resolve(CardComponent), {
  ssr: false,
});

export { Card };
