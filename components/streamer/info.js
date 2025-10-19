"use client";

import classNames from "classnames";
import Link from "next/link";

export default function StreamerInfo({ streamer, iframe }) {
  return (
    <div className="flex flex-col justify-center w-full h-auto overflow-hidden -space-y-0.5">
      {streamer.live ? (
        <>
          <Link
            className={classNames(
              "font-bold hover:underline text-lg line-clamp-1 uppercase",
              { "text-white": iframe }
            )}
            href={`https://kick.com/${streamer.slug}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {streamer.title || "Başlık bulunamadı"}
          </Link>
          <Link
            className={classNames("line-clamp-1 text-sm", {
              "text-white": iframe,
            })}
            href={`https://kick.com/${streamer.slug}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {streamer.name}
          </Link>
        </>
      ) : (
        <>
          <Link
            className={classNames("font-bold hover:underline text-lg", {
              "text-white": iframe,
            })}
            href={`https://kick.com/${streamer.slug}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {streamer.name?.toUpperCase()}
          </Link>
          <p
            className={classNames(
              "line-clamp-1 text-sm opacity-70 dark:opacity-70",
              {
                "text-white !opacity-100": iframe,
              }
            )}
          >
            Çevrimdışı
          </p>
        </>
      )}
    </div>
  );
}
