import { useModal } from "@/contexts/modal-context";
import { useNavigationContext } from "@/contexts/navigation-context";
import ControlsButton from "../button";

export default function ServerControls({ playing, handleToggle, isCountdown }) {
  const { openModal } = useModal();
  const { activeServerCode, servers } = useNavigationContext();

  const activeServer = servers?.find((s) => s.code === activeServerCode);
  const serverNameToSend = activeServer?.name || activeServerCode;

  return (
    <div className="w-full h-full flex space-x-3">
      <div className="w-full h-full flex items-center justify-end space-x-3 pointer-events-auto">
        {!isCountdown && (
          <ControlsButton
            icon="solar:video-frame-play-vertical-bold"
            onClick={() => openModal("KICK_CLIP_MODAL", {}, "center")}
          />
        )}
        {handleToggle && (
          <ControlsButton
            icon={!playing ? "solar:play-bold" : "solar:pause-bold"}
            onClick={handleToggle}
          />
        )}
        {!isCountdown && (
          <ControlsButton
            icon="solar:gallery-bold"
            onClick={() =>
              openModal(
                "GALLERY_MODAL",
                {
                  apiEndpoint: "/api/venny/gallery",
                  modalTitle: "Galeri Akışı",
                },
                "left"
              )
            }
          />
        )}
        {!isCountdown && (
          <ControlsButton
            icon="solar:tv-bold"
            onClick={() => openModal("WATCH_MODAL", {}, "center")}
          />
        )}
      </div>
      <div className="w-[300px] h-full shrink-0 flex items-center justify-center space-x-3 pointer-events-auto"></div>
      <div className="w-full h-full flex items-center justify-start space-x-3 pointer-events-auto">
        {!isCountdown && (
          <ControlsButton
            icon="solar:settings-bold"
            onClick={() => openModal("SETTINGS_MODAL")}
          />
        )}
        <ControlsButton
          icon="solar:face-scan-circle-bold"
          onClick={() =>
            openModal(
              "CONTACT_MODAL",
              { serverName: serverNameToSend },
              "center"
            )
          }
        />
      </div>
    </div>
  );
}
