// components/modal/modals/index.js
import Content_Creators_Modal from "./content-creators-modal";
import Settings_Modal from "./settings-modal";
import Contact_Modal from "./contact-modal";
import Gallery_Modal from "./gallery-modal";
import KickClipModal from "./clip-modal";
import Watch_Modal from "./watch-modal";
import Poll_Modal from "./poll-modal"; // Yeni modalı import et

export const MODAL_COMPONENTS = {
  CONTENT_CREATORS_MODAL: Content_Creators_Modal,
  SETTINGS_MODAL: Settings_Modal,
  KICK_CLIP_MODAL: KickClipModal,
  GALLERY_MODAL: Gallery_Modal,
  CONTACT_MODAL: Contact_Modal,
  WATCH_MODAL: Watch_Modal,
  POLL_MODAL: Poll_Modal, // Yeni modalı ekle
};
