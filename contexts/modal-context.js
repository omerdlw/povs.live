"use client";

import React, { createContext, useState, useContext } from "react";
import Modal from "@/components/modal";

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    position: "center",
    modalType: null,
    isOpen: false,
    props: {},
  });

  const openModal = (modalType, props = {}, position = "center") => {
    setModalState({
      isOpen: true,
      modalType,
      position,
      props,
    });
  };

  const closeModal = () => {
    setModalState((prevState) => ({ ...prevState, isOpen: false }));
  };

  const value = { ...modalState, openModal, closeModal };

  return (
    <ModalContext.Provider value={value}>
      {children}
      <Modal />
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
