"use client";

import classNames from "classnames";
import Icon from "../icon";

export default function StreamerAvatar({
  handleFavoriteClick,
  isFavorite,
  isHovered,
  streamer,
  iframe,
}) {
  return (
    <div
      className={classNames("w-16 h-16 shrink-0 relative", {
        "!w-12 !h-12": iframe === true,
      })}
    >
      {isHovered && (
        <div
          className="absolute inset-0 rounded-[20px] cursor-pointer w-full h-full center z-10 p-1 bg-white/40 dark:bg-black/40 backdrop-blur-sm"
          onClick={handleFavoriteClick}
        >
          <Icon
            className={isFavorite && "text-yellow-700 dark:text-yellow-500"}
            icon={isFavorite ? "solar:star-bold" : "solar:star-outline"}
          />
        </div>
      )}
      <img
        className="w-full h-full shrink-0 object-cover rounded-[20px] bg-gray-300 dark:bg-gray-700" // Yüklenirken gri arkaplan
        src={streamer.avatar}
        alt={streamer.name}
        loading="lazy"
      />
    </div>
  );
}
