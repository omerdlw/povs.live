import { NavigationProvider } from "@/contexts/navigation-context";
import { SettingsProvider } from "@/contexts/settings-context";
import { StreamerProvider } from "@/contexts/streamer-context";
import { ModalProvider } from "@/contexts/modal-context";
import { WatchProvider } from "@/contexts/watch-context";
import React from "react";

const providers = [
  SettingsProvider,
  NavigationProvider,
  StreamerProvider,
  WatchProvider,
  ModalProvider,
];

export const AppProviders = ({ children }) => {
  return providers.reduceRight((acc, Provider) => {
    return <Provider>{acc}</Provider>;
  }, children);
};
