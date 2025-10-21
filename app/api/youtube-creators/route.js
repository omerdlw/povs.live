import { NextResponse } from "next/server";
import { youtubers } from "@/data/youtubers";

// Sayıları (Abone, Görüntülenme) K/M formatına çevirir
function formatNumber(num) {
  if (!num) return "0";
  const number = parseInt(num, 10);
  if (number >= 1000000)
    return (number / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (number >= 1000)
    return (number / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return number.toLocaleString("tr-TR");
}

// Tarihi "X zaman önce" formatına çevirir
function formatPublishedAt(dateString) {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    if (diffMs < 0) return "şimdi";

    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30.44);
    const diffYears = Math.floor(diffDays / 365.25);

    if (diffYears >= 1) return `${diffYears} yıl önce`;
    if (diffMonths >= 1) return `${diffMonths} ay önce`;
    if (diffDays >= 1) return `${diffDays} gün önce`;
    if (diffHours >= 1) return `${diffHours} saat önce`;
    if (diffMinutes >= 1) return `${diffMinutes} dakika önce`;
    return "az önce";
  } catch (e) {
    return "bilinmiyor";
  }
}

async function getYouTubeChannelData(channelHandle) {
  const API_KEY = process.env.GOOGLE_API_KEY;
  const BASE_URL = "https://www.googleapis.com/youtube/v3";
  let channelId = "";
  let channelTitle = channelHandle;
  let channelAvatar = "https://via.placeholder.com/88?text=?";
  let subscriberCount = "0";
  let videos = [];

  try {
    // 1. Kanal Handle'ından Kanal ID'sini Bul
    const searchResponse = await fetch(
      `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(
        channelHandle
      )}&type=channel&key=${API_KEY}`
    );
    if (!searchResponse.ok) throw new Error("Channel search failed");

    const searchData = await searchResponse.json();
    if (!searchData.items || searchData.items.length === 0) {
      throw new Error(`Channel not found for ${channelHandle}`);
    }
    channelId = searchData.items[0].snippet.channelId;

    // 2. Kanal Bilgilerini ve Abone Sayısını Çek
    const channelResponse = await fetch(
      `${BASE_URL}/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`
    );
    if (!channelResponse.ok) throw new Error("Failed to fetch channel stats");

    const channelData = await channelResponse.json();
    if (channelData.items && channelData.items.length > 0) {
      const info = channelData.items[0];
      channelTitle = info.snippet.title;
      channelAvatar = info.snippet.thumbnails.default.url;
      subscriberCount = formatNumber(info.statistics.subscriberCount);
    }

    // 3. Kanalın Son 3 Videosunun ID'lerini Çek
    const videosResponse = await fetch(
      `${BASE_URL}/search?part=snippet&channelId=${channelId}&order=date&maxResults=3&type=video&key=${API_KEY}`
    );
    if (!videosResponse.ok) throw new Error("Failed to fetch video list");

    const videosData = await videosResponse.json();
    if (videosData.items && videosData.items.length > 0) {
      const videoIds = videosData.items
        .map((item) => item.id.videoId)
        .join(",");

      // 4. (GÜNCELLEME) Video ID'leri ile Görüntülenme Sayılarını Çek
      const statsResponse = await fetch(
        `${BASE_URL}/videos?part=snippet,statistics&id=${videoIds}&key=${API_KEY}`
      );
      if (!statsResponse.ok) throw new Error("Failed to fetch video stats");

      const statsData = await statsResponse.json();

      // 5. Videoları İstatistiklerle Birlikte Eşle
      videos = statsData.items.map((video) => ({
        title: video.snippet.title,
        url: `https://www.youtube.com/watch?v=${video.id}`,
        thumbnail: video.snippet.thumbnails.medium.url,
        views: formatNumber(video.statistics.viewCount), // "N/A" yerine gerçek veri
        publishedAt: formatPublishedAt(video.snippet.publishedAt),
      }));
    }
  } catch (error) {
    console.error(`Error fetching data for ${channelHandle}: ${error.message}`);
    // Hata durumunda bile temel bilgileri döndürmeye çalış
    return {
      id: channelHandle,
      channelName: channelTitle,
      channelUrl: `https://www.youtube.com/${channelHandle}`,
      channelAvatar: channelAvatar,
      subscriberCount: subscriberCount,
      videos: videos, // Hata oluştuysa 'videos' boş bir dizi olabilir
    };
  }

  return {
    id: channelHandle,
    channelName: channelTitle,
    channelUrl: `https://www.youtube.com/channel/${channelId}`,
    channelAvatar: channelAvatar,
    subscriberCount: subscriberCount,
    videos: videos,
  };
}

export async function GET(request) {
  const API_KEY = process.env.GOOGLE_API_KEY;

  if (!API_KEY || API_KEY === "BURAYA_KENDI_API_ANAHTARINIZI_YAPISTIRIN") {
    return NextResponse.json(
      {
        error:
          "GOOGLE_API_KEY ortam değişkeni ayarlanmadı. Lütfen .env.local dosyanızı kontrol edin.",
      },
      { status: 500 }
    );
  }

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    const results = await Promise.all(youtubers.map(getYouTubeChannelData));
    return NextResponse.json(results, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS(request) {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
