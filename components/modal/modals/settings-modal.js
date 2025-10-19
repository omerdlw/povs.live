"use client";

import { useSettings } from "@/contexts/settings-context";

export default function SettingsModal() {
  const { theme, setTheme, settings, updateSettings } = useSettings();

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Tema</h3>
          <div className="grid grid-cols-3 gap-2">
            {["light", "dark", "system"].map((themeOption) => (
              <button
                key={themeOption}
                onClick={() => setTheme(themeOption)}
                className={`p-4 rounded-[20px] ${
                  theme === themeOption
                    ? "bg-black/5 dark:bg-white/5"
                    : "hover:bg-black/10 dark:hover:bg-white/10"
                }`}
              >
                {themeOption}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Yayıncı Kartı</h3>
          <button
            onClick={() => updateSettings("largeStreamerCard", !settings.largeStreamerCard)}
            className={`w-full p-4 rounded-[20px] text-left ${
              settings.largeStreamerCard
                ? "bg-black/5 dark:bg-white/5"
                : "hover:bg-black/10 dark:hover:bg-white/10"
            }`}
          >
            Büyük Yayıncı Kartı {settings.largeStreamerCard ? "(Açık)" : "(Kapalı)"}
          </button>
        </div>
      </div>
    </div>
  );
}
