"use client";

import { Icon as IconifyIcon } from "@iconify-icon/react";

export default function Icon({
  className = "center",
  variant = "default",
  spin = false,
  size = 24,
  onClick,
  color,
  icon,
  ...props
}) {
  return (
    <IconifyIcon
      style={{ color: color }}
      className={className}
      onClick={onClick}
      height={size}
      icon={icon}
      size={size}
      {...props}
    />
  );
}
