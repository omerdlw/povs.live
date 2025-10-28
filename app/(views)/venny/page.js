"use client";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/";
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return <div>Yönlendiriliyorsunuz...</div>;
}
