import { useState } from "react";
import Title from "../title";
import Icon from "@/components/icon";
import { cn } from "@/lib/utils";
import { CALCULATE_LASTSTREAM } from "@/lib/utils";
import { streamerService } from "@/services/streamerService";

export default function KickClipModal({ close }) {
  const [clipUrl, setClipUrl] = useState("");
  const [clipInfo, setClipInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");

  const getClipIdFromUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split("/");
      if (
        pathSegments.length > 0 &&
        pathSegments[pathSegments.length - 2] === "clips"
      ) {
        return pathSegments[pathSegments.length - 1];
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  const handleFetchClip = async () => {
    const clipId = getClipIdFromUrl(clipUrl);
    if (!clipId) {
      setError("Geçersiz Kick klip URL'si.");
      return;
    }

    setLoading(true);
    setError("");
    setClipInfo(null);

    try {
      // 1. Klip bilgisini al
      const response = await fetch(`https://kick.com/api/v2/clips/${clipId}`);
      if (!response.ok) {
        throw new Error("Klip bilgileri alınamadı.");
      }
      const data = await response.json();

      if (!data || !data.clip) {
        throw new Error("API'den beklenen klip verisi gelmedi.");
      }

      // 2. Klip bilgisinden yayıncı adını al
      const streamerName = data.clip.channel?.username;

      // 3. streamerService ile yayıncının tam profilini (ve avatarını) al
      const streamerDetails = streamerName
        ? await streamerService.getStreamer(streamerName)
        : null;

      // 4. Bilgileri ayarla
      setClipInfo({
        id: data.clip.id,
        title: data.clip.title,
        thumbnailUrl: data.clip.thumbnail_url,
        videoUrl: data.clip.video_url,
        streamerName: data.clip.channel?.username || "Bilinmeyen Yayıncı",
        // streamerService'ten gelen güvenilir avatar URL'sini kullan
        streamerAvatar:
          streamerDetails?.avatar ||
          "https://files.kick.com/images/user/19420094/profile_image/conversion/default2-fullsize.webp",
        createdAt: data.clip.created_at,
        views: data.clip.views,
      });
    } catch (err) {
      setError(err.message || "Klip bilgileri alınırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!clipInfo || !clipInfo.videoUrl || isDownloading) return;

    setIsDownloading(true);
    setError("");

    try {
      const safeFileName = `${clipInfo.streamerName}_${clipInfo.id}.mp4`;
      const safeVideoUrl = encodeURIComponent(clipInfo.videoUrl);

      // API'ye istek at ve blob olarak indir
      const response = await fetch(
        `/api/download-clip?url=${safeVideoUrl}&fileName=${encodeURIComponent(
          safeFileName
        )}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "İndirme başarısız");
      }

      // Blob'u indir
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = safeFileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setIsDownloading(false);
    } catch (err) {
      setError(err.message || "İndirme başlatılırken bir hata oluştu.");
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Title
        title="Klip indirici"
        description="Klip bağlantısını yapıştırarak klip hakkında bilgi alabilir ve indirebilirsiniz"
      />
      <div className="p-4 space-y-4">
        {error && (
          <div className="bg-red-700 text-red-200 dark:bg-red-500 dark:text-red-100 font-semibold rounded-[20px] p-4 text-sm">
            {error}
          </div>
        )}
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={clipUrl}
            onChange={(e) => setClipUrl(e.target.value)}
            placeholder="https://kick.com/STREAMER/clip/..."
            className="bg-black/5 dark:bg-white/5 w-full rounded-[20px] p-4 h-14 resize-none focus:outline-none"
            disabled={loading}
          />
          <button
            onClick={handleFetchClip}
            disabled={loading}
            className={cn(
              "size-14 center shrink-0 cursor-pointer rounded-[20px] transition-colors",
              loading
                ? "bg-black/10 dark:bg-white/10"
                : "bg-purple-700 dark:bg-purple-500 text-white"
            )}
          >
            {loading ? (
              <Icon
                icon="mingcute:loading-3-fill"
                size={24}
                className="animate-spin"
              />
            ) : (
              <Icon icon="solar:arrow-right-linear" size={24} />
            )}
          </button>
        </div>
        {clipInfo && (
          <div className="space-y-4">
            <div className="flex space-x-4 rounded-[20px]">
              <img
                className="w-60 h-auto rounded-[20px] object-cover"
                src={clipInfo.thumbnailUrl}
                alt="img"
              />
              <div className="flex flex-col justify-center space-y-1 overflow-hidden">
                <h3 className="font-semibold truncate" title={clipInfo.title}>
                  {clipInfo.title}
                </h3>
                <div className="flex items-center space-x-2">
                  <img
                    src={clipInfo.streamerAvatar}
                    className="size-5 rounded-full"
                  />
                  <span className="text-sm opacity-80">
                    {clipInfo.streamerName}
                  </span>
                </div>
                <span className="text-sm opacity-60">
                  {clipInfo.views.toLocaleString()} görüntülenme
                </span>
                <span className="text-sm opacity-60">
                  {CALCULATE_LASTSTREAM(clipInfo.createdAt)} oluşturuldu
                </span>
              </div>
            </div>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className={cn(
                "w-full p-4 rounded-[20px] center space-x-2 cursor-pointer font-medium transition-colors",
                isDownloading
                  ? "bg-black/10 dark:bg-white/10 cursor-not-allowed"
                  : "bg-purple-700 dark:bg-purple-500 text-white"
              )}
            >
              {isDownloading ? (
                <Icon
                  icon="mingcute:loading-3-fill"
                  className="animate-spin"
                  size={20}
                />
              ) : (
                <Icon icon="solar:cloud-download-bold" size={20} />
              )}
              <span>
                {isDownloading
                  ? "Klibiniz indiriliyor..."
                  : "Klibi indirin (.mp4)"}
              </span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
