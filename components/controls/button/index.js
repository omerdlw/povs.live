import Icon from "@/components/icon";

export default function ControlsButton({
  text,
  description,
  icon,
  onClick,
  color,
}) {
  if (icon && !text) {
    return (
      <div
        className="size-[60px] center cursor-pointer rounded-3xl backdrop-blur-xl overflow-hidden bg-white/80 dark:bg-black/20 border border-black/10 dark:border-white/10 p-1"
        onClick={onClick}
      >
        {icon.startsWith("http") ? (
          <img src={icon} className="w-[50px] h-full rounded-[18px]" />
        ) : (
          <div className="w-full h-full rounded-[18px] center bg-black/5 dark:bg-white/5">
            {icon && <Icon icon={icon} color={color} />}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="h-[60px] center cursor-pointer rounded-3xl backdrop-blur-xl overflow-hidden bg-white/80 dark:bg-black/20 border border-black/10 dark:border-white/10 p-1"
      onClick={onClick}
    >
      {icon && icon.startsWith("http") ? (
        <img src={icon} className="w-[50px] h-full rounded-[18px]" />
      ) : (
        <div className="w-[50px] h-full shrink-0 rounded-[18px] center bg-black/5 dark:bg-white/5">
          {icon && <Icon icon={icon} color={color} />}
        </div>
      )}
      <div className="flex flex-col -space-y-0.5 px-3">
        <span className="truncate text-[15px]">{text}</span>
        {description && <span className="text-sm truncate">{description}</span>}
      </div>
    </div>
  );
}
