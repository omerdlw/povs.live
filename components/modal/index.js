"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useModal } from "@/contexts/modal-context";
import { MODAL_COMPONENTS } from "./modals";
import { useEffect } from "react";
import classNames from "classnames";

const positionClasses = {
  center: "items-center justify-center",
  bottom: "items-end justify-center",
  left: "items-start justify-start",
  top: "items-start justify-center",
  right: "items-start justify-end",
};

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const springTransition = {
  type: "spring",
  stiffness: 260,
  damping: 20,
};

const modalVariantsCenter = {
  hidden: { y: "-50px", scale: 0.95, opacity: 0 },
  visible: { y: 0, scale: 1, opacity: 1, transition: springTransition },
  exit: { y: "50px", scale: 0.95, opacity: 0, transition: { duration: 0.2 } },
};

const modalVariantsLeft = {
  hidden: { x: "-100%", opacity: 0 },
  visible: { x: 0, opacity: 1, transition: springTransition },
  exit: { x: "-100%", opacity: 0, transition: { duration: 0.2 } },
};

const modalVariantsRight = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: 0, opacity: 1, transition: springTransition },
  exit: { x: "100%", opacity: 0, transition: { duration: 0.2 } },
};

const getModalVariants = (position) => {
  switch (position) {
    case "left":
      return modalVariantsLeft;
    case "right":
      return modalVariantsRight;
    default:
      return modalVariantsCenter;
  }
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
  const isSideModal = position === "left" || position === "right";

  return (
    <AnimatePresence mode="wait">
      {isOpen && modalType && (
        <div
          className={classNames(
            "fixed inset-0 z-50 flex",
            positionClasses[position],
            {
              "p-4": !isSideModal,
            }
          )}
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
            className={classNames(
              "relative z-10 bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-black/15 dark:border-white/15",
              {
                "rounded-[30px]": !isSideModal,
                "h-screen": isSideModal,
                "border-y-0 border-l-0": position === "left",
                "border-y-0 border-r-0": position === "right",
              }
            )}
            variants={getModalVariants(position)}
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
