"use client";

import Icon from "@/components/icon";
import { CN } from "@/lib/utils";

export default function Loading({
  icon = "mingcute:loading-3-fill",
  fullScreen = false,
  size = 40,
  className,
  text,
}) {
  const containerClasses = CN(
    "flex flex-col items-center justify-center gap-4",
    fullScreen && "h-screen w-screen fixed inset-0 z-50",
    !fullScreen && "p-4",
    className,
  );

  return (
    <div className={containerClasses} role="status" aria-label="Loading">
      <div className="animate-spin">
        <Icon className="text-skin-primary" icon={icon} size={size} />
      </div>
      {text && (
        <p className="text-sm text-skin-primary animate-pulse">{text}</p>
      )}
    </div>
  );
}

export function LoadingSpinner({ size = 20, className }) {
  return (
    <div
      className={CN("animate-spin inline-block", className)}
      aria-label="Loading"
      role="status"
    >
      <Icon icon="mingcute:loading-3-fill" size={size} />
    </div>
  );
}
