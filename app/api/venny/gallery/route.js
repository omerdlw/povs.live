import { NextResponse } from "next/server";
import { discordService } from "@/services/discordService";

const GALLERY_CHANNEL_ID = "1068562697744035860";
const TWITTER_CHANNEL_ID = "1098858378727526460";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET(request) {
  const [galleryData, twitterData] = await Promise.all([
    discordService.getDiscordImages(GALLERY_CHANNEL_ID),
    discordService.getDiscordImages(TWITTER_CHANNEL_ID),
  ]);

  if (galleryData.error || twitterData.error) {
    return NextResponse.json(
      { error: galleryData.error || twitterData.error },
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }

  const combinedData = [...galleryData, ...twitterData];

  combinedData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return NextResponse.json(combinedData, {
    status: 200,
    headers: CORS_HEADERS,
  });
}

export async function OPTIONS(request) {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}
