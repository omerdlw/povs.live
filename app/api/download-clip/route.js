import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoUrl = searchParams.get("url");
    const fileName = searchParams.get("fileName") || "kick-clip.mp4";

    if (!videoUrl) {
      return new NextResponse("Video URL'si eksik.", { status: 400 });
    }

    // Gerçek bir tarayıcıyı taklit eden sahte başlıklar
    const spoofedHeaders = {
      Referer: "https://kick.com/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept:
        "video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5",
      "Accept-Language": "en-US,en;q=0.9",
    };

    // 1. ADIM: İlk isteği at, ANCAK yönlendirmeyi manuel olarak yakala
    const initialResponse = await fetch(videoUrl, {
      method: "GET",
      headers: spoofedHeaders,
      redirect: "manual", // Bu çok önemli!
    });

    let finalVideoUrl = videoUrl;

    // 2. ADIM: Eğer bir yönlendirme varsa (301, 302, 307, 308)
    if (initialResponse.status >= 300 && initialResponse.status < 400) {
      const locationHeader = initialResponse.headers.get("Location");
      if (locationHeader) {
        // Yeni (asıl) video URL'sini al
        finalVideoUrl = locationHeader;
      } else {
        throw new Error(
          "CDN yönlendirme yaptı ancak 'Location' başlığı bulunamadı."
        );
      }
    }

    // 3. ADIM: Asıl video URL'sine (ya da yönlendirme yoksa ilk URL'ye)
    // sahte başlıklarla TAM isteği at
    const videoResponse = await fetch(finalVideoUrl, {
      method: "GET",
      headers: spoofedHeaders,
    });

    if (!videoResponse.ok || !videoResponse.body) {
      console.error(
        "Kick CDN Son Hata:",
        videoResponse.status,
        videoResponse.statusText
      );
      throw new Error("Klipin nihai adresinden video verisi alınamadı.");
    }

    // 4. ADIM: Gelen videoyu (ReadableStream) doğrudan tarayıcıya stream et
    return new NextResponse(videoResponse.body, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${decodeURIComponent(
          fileName
        )}"`,
        "Content-Type": "video/mp4",
        "Content-Length": videoResponse.headers.get("Content-Length"),
        // Tarayıcının 1KB'lık hatalı dosyayı önbellekten kullanmasını engelle
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("İndirme proxy hatası:", error.message);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
