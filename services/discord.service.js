async function getDiscordImages(channelId) {
  const auth = process.env.DISCORD_TOKEN;

  if (!auth) {
    console.error("Ortam değişkeni ayarlanmamış.");
    return { error: "Sunucu yapılandırma hatası." };
  }

  const url = `https://discord.com/api/v10/channels/${channelId}/messages?limit=100`;
  const headers = {
    authorization: auth,
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "content-type": "application/json",
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 saniye

  try {
    const response = await fetch(url, {
      headers: headers,
      next: { revalidate: 60 },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.message || response.statusText };
    }

    const messages = await response.json();

    const images = messages.map((message) => {
      const author = message.author;
      const user_id = author.id;
      let username = author.username;
      const avatar_hash = author.avatar;
      const avatar_url = avatar_hash
        ? `https://cdn.discordapp.com/avatars/${user_id}/${avatar_hash}.png`
        : null;

      if (message.embeds?.[0]?.author?.name) {
        username = message.embeds[0].author.name;
      }

      const message_info = {
        username: username,
        avatar_url: avatar_url,
        content: message.content,
        embed_texts: [],
        images: [],
        timestamp: message.timestamp, // Sıralama için eklendi
      };

      message.attachments?.forEach((attachment) => {
        message_info.images.push(attachment.url);
      });

      message.embeds?.forEach((embed) => {
        if (embed.description) message_info.embed_texts.push(embed.description);
        if (embed.title) message_info.embed_texts.push(embed.title);
        embed.fields?.forEach((field) => {
          if (field.value) message_info.embed_texts.push(field.value);
        });
        if (embed.image) message_info.images.push(embed.image.url);
        if (embed.thumbnail) message_info.images.push(embed.thumbnail.url);
      });

      return message_info;
    });

    return images;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("Discord API Hatası:", error);

    if (error.name === "AbortError") {
      return { error: "Bağlantı zaman aşımına uğradı (20s)." };
    }

    return { error: error.message };
  }
}

export const discordService = {
  getDiscordImages,
};
