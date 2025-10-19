import { useModal } from "@/contexts/modal-context";
import { useNavigationContext } from "@/contexts/navigation-context";
import ControlsButton from "../button";

export default function ServerControls() {
  const { openModal } = useModal();
  const { activeServerCode, servers } = useNavigationContext();

  const activeServer = servers?.find((s) => s.code === activeServerCode);
  const serverNameToSend = activeServer?.name || activeServerCode;

  return (
    <div className="w-full h-full flex space-x-3">
      <div className="w-full h-full flex items-center justify-end space-x-3 pointer-events-auto">
        <ControlsButton
          icon="solar:settings-bold"
          onClick={() => openModal("SETTINGS_MODAL")}
        />
      </div>
      <div className="w-[300px] h-full shrink-0"></div>
      <div className="w-full h-full flex items-center justify-start space-x-3 pointer-events-auto">
        <ControlsButton
          icon="solar:tv-bold"
          onClick={() => openModal("WATCH_MODAL")}
        />
        <ControlsButton
          icon="solar:face-scan-circle-bold"
          onClick={() => openModal("CONTACT_MODAL", { serverName: serverNameToSend })}
        />
      </div>
    </div>
  );
}
