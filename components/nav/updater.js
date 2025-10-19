"use client";

import { useNavigationContext } from "@/contexts/navigation-context";
import { useEffect } from "react";

export function DynamicNavUpdater({ navItem }) {
  const { setDynamicNavItem } = useNavigationContext();

  useEffect(() => {
    setDynamicNavItem(navItem);
    return () => setDynamicNavItem(null);
  }, [navItem, setDynamicNavItem]);

  return null;
}
