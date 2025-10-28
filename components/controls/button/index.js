import Icon from "@/components/icon";
import { CN } from "@/lib/utils";

const BASE_STYLES =
  "center cursor-pointer group rounded-secondary backdrop-blur-xl overflow-hidden bg-white/80 dark:bg-black/20 border border-base/10 hover:border-primary p-1 transition-colors duration-200 ease-linear";

const ICON_CONTAINER_BASE = "rounded-tertiary center bg-base/5 center";

const IconWrapper = ({ icon, color, className, loading }) => {
  if (icon?.startsWith("http")) {
    return (
      <img src={icon} alt="" className="w-[50px] h-full rounded-secondary" />
    );
  }

  return (
    <div className={CN(ICON_CONTAINER_BASE, className)}>
      {icon && (
        <Icon className={loading && "animate-spin"} icon={icon} color={color} />
      )}
    </div>
  );
};

export default function ControlsButton({
  loading = false,
  description,
  className,
  onClick,
  color,
  text,
  icon,
  ...props
}) {
  const isIconOnly = icon && !text;

  return (
    <button
      type="button"
      className={CN(
        BASE_STYLES,
        isIconOnly ? "size-[60px]" : "h-[60px]",
        className
      )}
      onClick={onClick}
      aria-label={text || description}
      {...props}
    >
      {isIconOnly ? (
        <IconWrapper loading={loading} color={color} icon={icon} />
      ) : (
        <>
          <IconWrapper
            className="w-[50px] center h-full shrink-0 group-hover:bg-bg-primary dark:group-hover:bg-secondary group-hover:text-white transition-colors duration-200 ease-linear"
            loading={loading}
            color={color}
            icon={icon}
          />
          <div className="flex flex-col items-start -gap-0.5 px-3">
            <span className="text-[15px]">{text}</span>
            {description && (
              <span className="text-xs opacity-70">{description}</span>
            )}
          </div>
        </>
      )}
    </button>
  );
}
