import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const playlistUrl = searchParams.get("url");
    const fileName = searchParams.get("fileName") || "kick-clip.mp4";

    if (!playlistUrl) {
      return NextResponse.json(
        { error: "Video URL'si eksik." },
        { status: 400 }
      );
    }

    const playlistResponse = await fetch(playlistUrl);
    const playlistText = await playlistResponse.text();
    const lines = playlistText.split("\n");
    const segments = [];
    const baseUrl = playlistUrl.substring(0, playlistUrl.lastIndexOf("/") + 1);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // EXTINF satırı segment bilgisini içerir
      if (line.startsWith("#EXTINF:")) {
        const nextLine = lines[i + 1]?.trim();
        if (nextLine && !nextLine.startsWith("#")) {
          // BYTERANGE bilgisini al
          const byteRangeLine = lines[i - 1];
          let byteRange = null;

          if (byteRangeLine && byteRangeLine.includes("#EXT-X-BYTERANGE:")) {
            const rangeMatch = byteRangeLine.match(
              /#EXT-X-BYTERANGE:(\d+)@(\d+)/
            );
            if (rangeMatch) {
              byteRange = {
                length: parseInt(rangeMatch[1]),
                offset: parseInt(rangeMatch[2]),
              };
            }
          }

          segments.push({
            url: baseUrl + nextLine,
            byteRange,
          });
        }
      }
    }

    const videoChunks = [];

    for (const segment of segments) {
      const headers = {};

      if (segment.byteRange) {
        // Byte range request
        const end = segment.byteRange.offset + segment.byteRange.length - 1;
        headers["Range"] = `bytes=${segment.byteRange.offset}-${end}`;
      }

      const segmentResponse = await fetch(segment.url, { headers });
      const segmentData = await segmentResponse.arrayBuffer();
      videoChunks.push(new Uint8Array(segmentData));
    }

    // 4. Tüm chunk'ları birleştir
    const totalLength = videoChunks.reduce(
      (sum, chunk) => sum + chunk.length,
      0
    );
    const mergedVideo = new Uint8Array(totalLength);

    let offset = 0;
    for (const chunk of videoChunks) {
      mergedVideo.set(chunk, offset);
      offset += chunk.length;
    }

    // 5. Birleştirilmiş videoyu döndür
    return new NextResponse(mergedVideo.buffer, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${decodeURIComponent(
          fileName
        )}"`,
        "Content-Type": "video/mp4",
        "Content-Length": totalLength.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
