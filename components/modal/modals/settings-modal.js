"use client";

import { useSettings } from "@/contexts/settings-context";
import Title from "../title";
import { cn } from "@/lib/utils";

export default function SettingsModal() {
  const { theme, setTheme, settings, updateSettings } = useSettings();

  const themeOptions = [
    { id: "light", label: "Açık" },
    { id: "dark", label: "Koyu" },
    { id: "system", label: "Sistem" }
  ];

  return (
    <>
      <Title
        title="Ayarlar"
        description="Sistem ayarlarını buradan yönetebilirsiniz"
      />
      <div className="p-4 space-y-6">
        <div>
          <h3 className="text-sm font-semibold mb-3">Tema Seçenekleri</h3>
          <div className="grid grid-cols-3 gap-2">
            {themeOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setTheme(option.id)}
                className={cn(
                  "p-4 rounded-[20px] font-medium transition-colors",
                  theme === option.id
                    ? "bg-purple-700 dark:bg-purple-500 text-white"
                    : "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold mb-3">Yayıncı Kartı Boyutu</h3>
          <button
            onClick={() => updateSettings("largeStreamerCard", !settings.largeStreamerCard)}
            className={cn(
              "w-full p-4 rounded-[20px] text-left font-medium transition-colors",
              settings.largeStreamerCard
                ? "bg-purple-700 dark:bg-purple-500 text-white"
                : "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
            )}
          >
            Büyük Yayıncı Kartı {settings.largeStreamerCard ? "(Açık)" : "(Kapalı)"}
          </button>
        </div>
      </div>
    </>
  );
}
