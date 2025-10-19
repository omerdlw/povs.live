import WatchGrid from "@/components/watch/watch-grid";

export default async function WatchPage({ searchParams }) {
  // Make sure to await the searchParams
  const params = await searchParams;
  const streamers = params?.streamers || "";

  // Filter out empty strings after split
  const streamerArray = streamers
    .split(",")
    .filter((streamer) => streamer.trim().length > 0);

  return <WatchGrid streamers={streamerArray} />;
}
