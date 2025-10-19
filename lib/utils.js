import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function CONVERT_NUM(num) {
  if (typeof num !== "number") return num; // Sayı değilse olduğu gibi döndür
  if (num > 999999) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M"; // .0 ise kaldır
  } else if (num > 999) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K"; // .0 ise kaldır
  } else {
    return num.toString();
  }
}

export function FORMAT_NUMBER(num) {
  if (typeof num !== "number") return num;
  if (num >= 1000000) {
    const formatted = (num / 1000000).toFixed(1);
    return formatted.endsWith(".0")
      ? Math.floor(num / 1000000) + "M"
      : formatted + "M";
  }
  if (num >= 1000) {
    const formatted = (num / 1000).toFixed(1);
    return formatted.endsWith(".0")
      ? Math.floor(num / 1000) + "K"
      : formatted + "K";
  }
  return num.toString();
}

export function CALCULATE_LASTSTREAM(startTime) {
  if (!startTime) return null;
  try {
    const startDate = new Date(startTime);
    const now = new Date();

    const diffMs = now - startDate;
    if (diffMs < 0) return "şimdi";

    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30); // Yaklaşık hesap
    const diffYears = Math.floor(diffDays / 365); // Yaklaşık hesap

    if (diffYears >= 1) {
      return `${diffYears} yıl önce`;
    } else if (diffMonths >= 1) {
      return `${diffMonths} ay önce`;
    } else if (diffDays >= 1) {
      return `${diffDays} gün önce`;
    } else if (diffHours >= 1) {
      return `${diffHours} saat önce`;
    } else if (diffMinutes >= 1) {
      return `${diffMinutes} dakika önce`;
    } else {
      return "az önce";
    }
  } catch (e) {
    console.error("CALCULATE_LASTSTREAM Error:", e);
    return "bilinmiyor";
  }
}

export function FILTER_NULLS(array) {
  if (!Array.isArray(array)) {
    return [];
  }
  return array.filter((item) => {
    return (
      typeof item !== "function" &&
      item !== undefined &&
      item !== false &&
      item !== null &&
      item !== ""
    );
  });
}

export function CALCULATE_UPTIME(start_time) {
  if (!start_time) return "00:00";
  try {
    var end_time = new Date();
    var start_time_date = new Date(start_time);
    var elapsed_time_ms = end_time - start_time_date;
    if (elapsed_time_ms < 0) return "00:00"; // Gelecekteki tarih hatası

    var elapsed_time_sec = Math.floor(elapsed_time_ms / 1000);
    var seconds = elapsed_time_sec % 60;
    var minutes = Math.floor(elapsed_time_sec / 60) % 60;
    var hours = Math.floor(elapsed_time_sec / 3600);

    const hoursStr = hours.toString().padStart(2, "0");
    const minutesStr = minutes.toString().padStart(2, "0");
    const secondsStr = seconds.toString().padStart(2, "0");

    if (hours > 0) {
      return `${hoursStr}:${minutesStr}:${secondsStr}`;
    } else {
      return `${minutesStr}:${secondsStr}`;
    }
  } catch (e) {
    console.error("CALCULATE_UPTIME2 Error:", e);
    return "00:00"; // Hata durumunda
  }
}

export function CONVERT_GAME(name) {
  if (name === "Grand Theft Auto V (GTA)") {
    return "GTA V";
  } else {
    return name;
  }
}
