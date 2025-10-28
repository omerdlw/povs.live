import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { REGEX_PATTERNS } from "@/config/constants";

export function CN(...inputs) {
  return twMerge(clsx(inputs));
}

export function CAPITALIZE_FIRST_LETTER(string) {
  if (!string || typeof string !== "string") {
    return "";
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function TRUNCATE_TEXT(text, maxLength, suffix = "...") {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - suffix.length).trim() + suffix;
}

export function FORMAT_DATE(
  dateString,
  options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
  locale = "en-US"
) {
  if (!dateString) {
    return "";
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "";
    }
    return date.toLocaleDateString(locale, options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
}

export function GET_RELATIVE_TIME(dateString) {
  if (!dateString) {
    return "";
  }

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(diffInSeconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
      }
    }

    return "just now";
  } catch (error) {
    console.error("Error calculating relative time:", error);
    return "";
  }
}

export function IS_VALID_URL(url) {
  if (!url || typeof url !== "string") {
    return false;
  }
  return REGEX_PATTERNS.URL.test(url);
}

export function IS_VALID_EMAIL(email) {
  if (!email || typeof email !== "string") {
    return false;
  }
  return REGEX_PATTERNS.EMAIL.test(email);
}

export function IS_BROWSER() {
  return typeof window !== "undefined";
}

export function GET_STORAGE_ITEM(key, defaultValue = null) {
  if (!IS_BROWSER()) {
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
}

export function SET_STORAGE_ITEM(key, value) {
  if (!IS_BROWSER()) {
    return false;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
    return false;
  }
}

export function REMOVE_STORAGE_ITEM(key) {
  if (!IS_BROWSER()) {
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
    return false;
  }
}

export function GROUP_BY(array, keyFn) {
  if (!Array.isArray(array)) {
    return {};
  }

  return array.reduce((result, item) => {
    const key = keyFn(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
    return result;
  }, {});
}

export function UNIQUE_ARRAY(array, keyFn) {
  if (!Array.isArray(array)) {
    return [];
  }

  if (!keyFn) {
    return [...new Set(array)];
  }

  const seen = new Set();
  return array.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export function DEEP_CLONE(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (obj instanceof Array) {
    return obj.map((item) => DEEP_CLONE(item));
  }

  if (obj instanceof Object) {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = DEEP_CLONE(obj[key]);
      }
    }
    return clonedObj;
  }
}

export function DEBOUNCE(func, wait = 300) {
  let timeoutId;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeoutId);
      func(...args);
    };

    clearTimeout(timeoutId);
    timeoutId = setTimeout(later, wait);
  };
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

    const hoursStr = hours - Number(3);
    const minutesStr = minutes.toString().padStart(2, "0");
    const secondsStr = seconds.toString().padStart(2, "0");

    if (hours > 0) {
      return `${hoursStr
        .toString()
        .padStart(2, "0")}:${minutesStr}:${secondsStr}`;
    } else {
      return `${minutesStr}:${secondsStr}`;
    }
  } catch (e) {
    console.error("CALCULATE_UPTIME Error:", e); // Hata mesajı düzeltildi
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
