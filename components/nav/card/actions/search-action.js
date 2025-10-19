"use client";

import { useNavigationContext } from "@/contexts/navigation-context";

export default function SearchAction() {
  const { searchQuery, setSearchQuery } = useNavigationContext();

  return (
    <div
      className="h-auto rounded-[20px] mt-2.5 w-full flex items-center p-4 gap-3 bg-black/5 dark:bg-white/5"
      onClick={(e) => e.stopPropagation()}
    >
      <input
        className="w-full bg-transparent focus:outline-none placeholder-black/50 dark:placeholder-white/50"
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="sunucu içinde arayın"
        value={searchQuery}
        type="text"
      />
    </div>
  );
}
