"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useModal } from "@/contexts/modal-context";
import { MODAL_COMPONENTS } from "./modals";
import { useEffect } from "react";

const positionClasses = {
  center: "items-center justify-center",
  bottom: "items-end justify-center",
  left: "items-center justify-start",
  top: "items-start justify-center",
  right: "items-center justify-end",
};

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  hidden: {
    y: "-50px",
    scale: 0.95,
    opacity: 0,
  },
  visible: {
    y: 0,
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
  exit: {
    y: "50px",
    scale: 0.95,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

const Modal = () => {
  const { isOpen, closeModal, modalType, props: data, position } = useModal();

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeModal]);

  if (modalType && !MODAL_COMPONENTS[modalType]) {
    console.error(
      `Modal type "${modalType}" is not defined in MODAL_COMPONENTS.`
    );
    return null;
  }

  const SpecificModalComponent = MODAL_COMPONENTS[modalType];

  return (
    <AnimatePresence mode="wait">
      {isOpen && modalType && (
        <div
          className={`fixed inset-0 z-50 flex ${positionClasses[position]} p-4`}
        >
          <motion.div
            className="fixed inset-0 -z-10 bg-white/80 dark:bg-black/60"
            onClick={closeModal}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          />
          <motion.div
            className="relative z-10 bg-white/40 dark:bg-black/40 backdrop-blur-xl rounded-[30px] border border-black/15 dark:border-white/15"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <SpecificModalComponent close={closeModal} data={data} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
