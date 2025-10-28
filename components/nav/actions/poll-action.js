"use client";

import { useNavigationContext } from "@/contexts/navigation-context";
import { useStreamer } from "@/contexts/streamer-context";
import { useModal } from "@/contexts/modal-context";

export default function PollAction() {
  const { openModal } = useModal();
  const { serverDetails } = useStreamer();
  const { activeServerCode } = useNavigationContext();

  const pollData = serverDetails?.POLL;

  if (!pollData || !pollData.question) {
    return null;
  }

  const handleOpenPollModal = (e) => {
    e.stopPropagation();
    openModal(
      "POLL_MODAL",
      {
        pollData: pollData,
        serverName: serverDetails?.NAME || activeServerCode,
      },
      "center"
    );
  };

  return (
    <button
      onClick={handleOpenPollModal}
      className="h-auto rounded-secondary mt-2.5 w-full flex items-center justify-center cursor-pointer p-3 gap-3 bg-primary text-white transition"
    >
      <span className="font-bold">Aktif ankete katılın</span>
    </button>
  );
}
