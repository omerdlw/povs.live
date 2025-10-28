import { NextResponse } from "next/server";
import { youtubers } from "@/data/youtubers";

const BASE_URL = "https://www.googleapis.com/youtube/v3";

function formatNumber(num) {
  if (!num) return "0";
  const number = parseInt(num, 10);
  if (Number.isNaN(number)) return "0";
  if (number >= 1_000_000)
    return (number / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (number >= 1_000)
    return (number / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return number.toLocaleString("tr-TR");
}

function formatPublishedAt(dateString) {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    if (diffMs < 0) return "şimdi";

    const sec = Math.floor(diffMs / 1000);
    const min = Math.floor(sec / 60);
    const hour = Math.floor(min / 60);
    const day = Math.floor(hour / 24);
    const month = Math.floor(day / 30.44);
    const year = Math.floor(day / 365.25);

    if (year >= 1) return `${year} yıl önce`;
    if (month >= 1) return `${month} ay önce`;
    if (day >= 1) return `${day} gün önce`;
    if (hour >= 1) return `${hour} saat önce`;
    if (min >= 1) return `${min} dakika önce`;
    return "az önce";
  } catch {
    return "bilinmiyor";
  }
}

function safeThumbnail(snippet) {
  return (
    snippet?.thumbnails?.high?.url ||
    snippet?.thumbnails?.medium?.url ||
    snippet?.thumbnails?.default?.url ||
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjMzRjRGNCIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OTk5OSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2Ij5ZT1VUUUJFPC90ZXh0Pgo8L3N2Zz4K"
  );
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

async function resolveChannelIdByHandle(handle, apiKey) {
  const clean = (handle || "").replace(/^@/, "").trim();
  if (!clean) throw new Error("Geçersiz handle");

  // 1) Önce search API ile dene (daha güvenilir)
  try {
    const searchUrl = `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(clean)}&type=channel&maxResults=5&key=${apiKey}`;
    const search = await fetchJSON(searchUrl);

    if (search?.items?.length > 0) {
      // Exact match ara
      for (const item of search.items) {
        const channelTitle = item.snippet?.title?.toLowerCase() || "";
        const customUrl = item.snippet?.customUrl?.toLowerCase() || "";

        // Handle veya kanal adı eşleşmesi
        if (
          customUrl === clean.toLowerCase() ||
          channelTitle === clean.toLowerCase() ||
          customUrl.includes(clean.toLowerCase())
        ) {
          return item.snippet.channelId;
        }
      }

      // Exact match yoksa ilk sonucu al
      return search.items[0].snippet.channelId;
    }
  } catch (err) {
    console.warn(`Search API failed for ${handle}:`, err.message);
  }

  // 2) forHandle API'yi dene (yedek)
  try {
    const data = await fetchJSON(
      `${BASE_URL}/channels?part=id&forHandle=${encodeURIComponent(clean)}&key=${apiKey}`,
    );
    const id = data?.items?.[0]?.id;
    if (id) return id;
  } catch (err) {
    console.warn(`forHandle API failed for ${handle}:`, err.message);
  }

  throw new Error(`Kanal bulunamadı: ${handle}`);
}

async function getChannelCore(channelId, apiKey) {
  const data = await fetchJSON(
    `${BASE_URL}/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`,
  );
  const info = data?.items?.[0];
  if (!info) throw new Error("Kanal bulunamadı");

  const title = info.snippet?.title || "Bilinmiyor";
  const avatar =
    info.snippet?.thumbnails?.high?.url ||
    info.snippet?.thumbnails?.medium?.url ||
    info.snippet?.thumbnails?.default?.url ||
    "https://via.placeholder.com/88?text=?";
  const subs = formatNumber(info.statistics?.subscriberCount);

  return { title, avatar, subs };
}

async function getLastVideos(channelId, apiKey, maxResults = 3) {
  // Son videoların ID'leri
  const list = await fetchJSON(
    `${BASE_URL}/search?part=snippet&channelId=${channelId}&order=date&maxResults=${maxResults}&type=video&key=${apiKey}`,
  );
  const items = list?.items || [];
  if (items.length === 0) return [];

  const ids = items
    .map((it) => it.id?.videoId)
    .filter(Boolean)
    .join(",");
  if (!ids) return [];

  // Video istatistikleri
  const stats = await fetchJSON(
    `${BASE_URL}/videos?part=snippet,statistics&id=${ids}&key=${apiKey}`,
  );
  const videos = (stats?.items || []).map((v) => ({
    title: v.snippet?.title || "Video",
    url: `https://www.youtube.com/watch?v=${v.id}`,
    thumbnail: safeThumbnail(v.snippet),
    views: formatNumber(v.statistics?.viewCount),
    publishedAt: formatPublishedAt(v.snippet?.publishedAt),
  }));

  return videos;
}

async function buildCreatorRecord(entry, apiKey) {
  const handle = typeof entry === "string" ? entry : entry?.handle;
  const presetChannelId = typeof entry === "object" ? entry?.channelId : null;

  let channelId = presetChannelId || "";
  let channelTitle = handle || "Kanal";
  let channelAvatar =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHZpZXdCb3g9IjAgMCA4OCA4OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijg4IiBoZWlnaHQ9Ijg4IiByeD0iNDQiIGZpbGw9IiNGM0Y0RjYiLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTk5OTkiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCI+Pz88L3RleHQ+Cjwvc3ZnPgo=";
  let subscriberCount = "0";
  let videos = [];

  try {
    if (!channelId) {
      channelId = await resolveChannelIdByHandle(handle, apiKey);
    }
    const core = await getChannelCore(channelId, apiKey);
    channelTitle = core.title;
    channelAvatar = core.avatar;
    subscriberCount = core.subs;

    videos = await getLastVideos(channelId, apiKey, 3);

    return {
      id: handle || channelId,
      channelName: channelTitle,
      channelUrl: `https://www.youtube.com/channel/${channelId}`,
      channelAvatar,
      subscriberCount,
      videos,
    };
  } catch (err) {
    // Hata olsa bile, temel verileri döndür
    return {
      id: handle || channelId || "unknown",
      channelName: channelTitle,
      channelUrl: channelId
        ? `https://www.youtube.com/channel/${channelId}`
        : handle
          ? `https://www.youtube.com/${handle.replace(/^@/, "")}`
          : "https://www.youtube.com",
      channelAvatar,
      subscriberCount,
      videos,
      error: err.message,
    };
  }
}

export async function GET(req) {
  const API_KEY = "AIzaSyAzSsjbpBoMIuNui4NjU2OFNAY6ZzhfM_w";

  if (!API_KEY || API_KEY === "BURAYA_KENDI_API_ANAHTARINIZI_YAPISTIRIN") {
    return NextResponse.json(
      {
        error:
          "GOOGLE_API_KEY ortam değişkeni ayarlanmadı. Lütfen .envf.local dosyasını kontrol edin.",
      },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(req.url);
  const channelsParam = searchParams.get("channels");
  let list = youtubers;

  if (channelsParam) {
    const parsed = channelsParam
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
      .map((h) => ({ handle: h }));
    if (parsed.length > 0) list = parsed;
  }

  try {
    const results = await Promise.all(
      list.map((entry) => buildCreatorRecord(entry, API_KEY)),
    );
    return NextResponse.json(results, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Bilinmeyen hata" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
