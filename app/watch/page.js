import WatchGrid from "@/components/watch/watch-grid";

export default async function WatchPage({ searchParams }) {
  const params = await searchParams;
  const streamers = params?.streamers || "";

  const streamerArray = streamers
    .split(",")
    .filter((streamer) => streamer.trim().length > 0);

  return <WatchGrid streamers={streamerArray} />;
}
