import { API_ENDPOINTS } from "@/config/constants";
import { CONVERT_GAME } from "@/lib/utils";

const CORS_PROXY = "";

const cache = new Map();
const CACHE_DURATION = 30000;

const MAX_CONCURRENT_REQUESTS = 50;

export const streamerService = {
  getCachedData(key) {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    cache.delete(key);
    return null;
  },

  setCachedData(key, data) {
    cache.set(key, { data, timestamp: Date.now() });
  },

  async fetchWithRetry(url, options = {}, retries = 2) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const fetchOptions = {
      ...options,
      signal: controller.signal,
      mode: "cors",
      credentials: "omit",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    try {
      const response = await fetch(CORS_PROXY + url, fetchOptions);
      clearTimeout(timeout);

      if (!response.ok) {
        return;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeout);

      if (retries > 0 && error.name !== "AbortError") {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1s bekle
        return this.fetchWithRetry(url, options, retries - 1);
      }
    }
  },

  async getVideos(username) {
    if (!username?.trim()) return [];

    const cacheKey = `videos_${username}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    const apiUrl = API_ENDPOINTS.KICK.VIDEOS(username);

    try {
      const data = await this.fetchWithRetry(apiUrl, { method: "GET" });
      const videos = data?.livestreams || data || [];
      this.setCachedData(cacheKey, videos);
      return videos;
    } catch (error) {
      return [];
    }
  },

  async getStreamer(username) {
    if (!username?.trim()) {
      return this.getDefaultStreamerData(username || "invalid");
    }

    const cacheKey = `streamer_${username}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    const apiUrl = `https://kick.com/api/v2/channels/${username}`;

    try {
      const channelData = await this.fetchWithRetry(apiUrl, { method: "GET" });

      const videosData = channelData?.livestream
        ? []
        : await this.getVideos(username);

      const result = {
        avatar:
          channelData.user?.profile_pic ||
          "https://files.kick.com/images/user/19420094/profile_image/conversion/default2-fullsize.webp",
        lastStreamed: videosData?.[0]?.start_time || null,
        createdAt: channelData.user?.email_verified_at || null,
        name: channelData.user?.username,
        game: CONVERT_GAME(channelData.livestream?.categories?.[0]?.name) || "",
        slug:
          channelData.user?.username?.toLowerCase().replace(/_/g, "-") ||
          username.toLowerCase().replace(/_/g, "-"),
        startedAt: channelData.livestream?.start_time || null,
        viewers: channelData.livestream?.viewer_count || 0,
        title: channelData.livestream?.session_title || "",
        followers: channelData.followers_count || 0,
        verified: channelData.verified || false,
        bio: channelData.user?.bio || "",
        live: !!channelData.livestream,
        platform: "kick",
        id: channelData.id,
      };

      this.setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      return this.getDefaultStreamerData(username);
    }
  },

  getDefaultStreamerData(username) {
    return {
      avatar:
        "https://files.kick.com/images/user/19420094/profile_image/conversion/default2-fullsize.webp",
      platform: "kick",
      createdAt: null,
      lastStreamed: null,
      startedAt: null,
      verified: false,
      name: username?.toLowerCase() || "unknown",
      slug: username?.toLowerCase().replace(/_/g, "-") || "unknown",
      followers: 0,
      live: false,
      viewers: 0,
      title: "",
      game: "",
      bio: "",
      id: null,
    };
  },

  async getMultipleStreamersInfo(usernames) {
    if (!usernames?.length) return {};

    const uniqueUsernames = [...new Set(usernames)];
    const results = {};

    for (let i = 0; i < uniqueUsernames.length; i += MAX_CONCURRENT_REQUESTS) {
      const batch = uniqueUsernames.slice(i, i + MAX_CONCURRENT_REQUESTS);

      const batchPromises = batch.map(async (username) => {
        try {
          const info = await this.getStreamer(username);
          return { username, info };
        } catch (error) {
          return {
            username,
            info: this.getDefaultStreamerData(username),
          };
        }
      });

      const batchResults = await Promise.allSettled(batchPromises);

      batchResults.forEach((result) => {
        if (result.status === "fulfilled") {
          const { username, info } = result.value;
          results[`${username}-kick`] = info;
        }
      });

      if (i + MAX_CONCURRENT_REQUESTS < uniqueUsernames.length) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    return results;
  },

  clearCache() {
    cache.clear();
  },
};
