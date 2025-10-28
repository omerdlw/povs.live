"use client";

import { useModal } from "@/contexts/modal-context";
import HomeControls from "./views/home-controls";
import { usePathname } from "next/navigation";
import Icon from "../icon";

export default function Controls() {
  const pathname = usePathname();
  const { openModal } = useModal();

  const renderViewSpecificControls = () => {
    if (pathname === "/") {
      return <HomeControls />;
    }
    return null;
  };

  return (
    <>
      <div className="fixed bottom-4 left-4 z-40">
        <button
          onClick={() => openModal("SETTINGS_MODAL")}
          className="size-10 center cursor-pointer backdrop-blur-lg rounded-full border border-base/10 hover:border-primary bg-white/60 dark:bg-black/40 transition-colors duration-200 ease-linear"
          aria-label="Open settings"
        >
          <Icon size={20} icon={"solar:settings-bold"} />
        </button>
      </div>
      <div className="fixed left-0 right-0 bottom-0 w-full h-[85px] z-30 pointer-events-none">
        {renderViewSpecificControls()}
      </div>
    </>
  );
}
