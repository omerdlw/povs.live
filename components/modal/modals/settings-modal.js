import Icon from "@/components/icon";
import { useSettings } from "@/contexts/settings-context";
import { CN } from "@/lib/utils";

const THEME_OPTIONS = [
  { value: "light", icon: <Icon icon={"solar:sun-2-bold"} /> },
  { value: "dark", icon: <Icon icon={"solar:moon-bold"} /> },
  {
    value: "system",
    icon: <Icon icon={"solar:screencast-2-bold"} />,
  },
];

export default function SettingsModal() {
  const { theme, setTheme, settings, updateSettings } = useSettings();

  return (
    <div className="w-full flex flex-col gap-3 p-3">
      <div className="w-full flex items-center gap-4">
        {THEME_OPTIONS.map(({ value, label, icon }) => (
          <button
            className={CN(
              "py-5 px-8 rounded-secondary bg-base/5 hover:bg-transparent border border-transparent hover:border-black/10 dark:hover:border-white/10 cursor-pointer transition",
              theme === value && "bg-primary hover:bg-primary"
            )}
            onClick={() => setTheme(value)}
            aria-pressed={theme === value}
            type="button"
            key={value}
          >
            {icon}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between p-5 bg-base/5 rounded-secondary">
        <span className="text-sm font-medium">Büyük Yayıncı Kartı</span>
        <button
          onClick={() =>
            updateSettings({ largeStreamerCard: !settings.largeStreamerCard })
          }
          className={CN(
            "w-12 h-6 cursor-pointer rounded-full transition-colors relative",
            settings.largeStreamerCard ? "bg-primary" : "bg-base/10"
          )}
        >
          <span
            className={CN(
              "block w-5 h-5 bg-white rounded-full transition-transform",
              settings.largeStreamerCard
                ? "translate-x-[26px]"
                : "translate-x-0.5"
            )}
          />
        </button>
      </div>
    </div>
  );
}
