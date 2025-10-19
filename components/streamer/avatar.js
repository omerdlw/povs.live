"use client";

import classNames from "classnames";

export default function StreamerAvatar({ streamer, iframe }) {
  return (
    <div
      className={classNames("w-16 h-16 shrink-0 relative", {
        "!w-12 !h-12": iframe === true,
      })}
    >
      <img
        className="w-full h-full shrink-0 object-cover rounded-[20px] bg-gray-300 dark:bg-gray-700" // Yüklenirken gri arkaplan
        src={streamer.avatar}
        alt={streamer.name}
        loading="lazy"
      />
    </div>
  );
}
