"use client";
import { UiContextType } from "@/types/SidebarOpen";
import React, { createContext, useState, ReactNode } from "react";

interface UiProviderProps {
  children: ReactNode;
}

export const UiContext = createContext<UiContextType | undefined>(undefined);

export const UiProvider: React.FC<UiProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(true);

  return (
    <UiContext.Provider value={{ open, setOpen }}>
      {children}
    </UiContext.Provider>
  );
};
