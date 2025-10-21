"use client";

import classNames from "classnames";
import Icon from "../icon";
import {
  CALCULATE_LASTSTREAM,
  CALCULATE_UPTIME,
  // CALCULATE_UPTIME2, // Bu fonksiyon lib/utils.js dosyasında bulunmuyor, kaldırıldı.
  FORMAT_NUMBER,
} from "@/lib/utils";

function StreamerStat({ noRightBorder, icon, text, isGame }) {
  return (
    <div
      className={classNames(
        "flex items-center space-x-1.5 h-full w-full flex-auto text-black/75 dark:text-white/75",
        { "border-r border-black/5 dark:border-white/5": !noRightBorder }
      )}
    >
      {icon && (
        <div className="h-full w-auto px-4 shrink-0 flex items-center justify-center border-r border-black/5 dark:border-white/5">
          <Icon className={!noRightBorder ? "ml-1.5" : ""} icon={icon.name} />
        </div>
      )}
      {text && (
        <p
          className={classNames("text-sm line-clamp-1 truncate px-3", {
            "font-semibold uppercase": isGame,
          })}
          title={text}
        >
          {text}
        </p>
      )}
    </div>
  );
}

export default function StreamerStats({ streamer }) {
  if (!streamer || !streamer.live) {
    return (
      <div className="flex items-center flex-auto flex-nowrap w-full h-12 bg-black/5 dark:bg-white/5 rounded-[20px] overflow-hidden">
        <StreamerStat
          icon={{ name: "solar:users-group-rounded-bold" }}
          text={`${FORMAT_NUMBER(streamer?.followers || 0)} takipçi`}
        />
        <StreamerStat
          icon={{ name: "solar:history-bold" }}
          text={
            streamer?.lastStreamed
              ? CALCULATE_LASTSTREAM(streamer.lastStreamed) + " yayındaydı"
              : "Yayın bilgisi yok"
          }
          noRightBorder
        />
      </div>
    );
  }

  return (
    <div className="flex items-center flex-auto flex-nowrap w-full h-12 bg-black/5 dark:bg-white/5 rounded-[20px] overflow-hidden">
      <StreamerStat
        isGame
        icon={{ name: "solar:gamepad-bold" }}
        text={streamer.game || "Oyun Yok"}
      />
      <StreamerStat
        text={FORMAT_NUMBER(streamer.viewers)}
        icon={{ name: "solar:eye-bold" }}
      />
      <StreamerStat
        text={CALCULATE_UPTIME(streamer.startedAt)}
        icon={{ name: "solar:clock-circle-bold" }}
        noRightBorder
      />
    </div>
  );
}
