"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { ResponsiveModalDrawer } from "@/components/ui/responsive-modal";

interface DialogState {
  isOpen: boolean;
  title: string;
  content: ReactNode | null;
}

interface DialogContextType {
  dialogState: DialogState;
  openDialog: (title: string, content: ReactNode) => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    title: "",
    content: null,
  });

  const openDialog = (title: string, content: ReactNode) => {
    setDialogState({
      isOpen: true,
      title,
      content,
    });
  };

  const closeDialog = () => {
    setDialogState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  return (
    <DialogContext.Provider value={{ dialogState, openDialog, closeDialog }}>
      {children}
      <ResponsiveModalDrawer
        open={dialogState.isOpen}
        onOpenChange={closeDialog}
        title={dialogState.title}
      >
        {dialogState.content}
      </ResponsiveModalDrawer>
    </DialogContext.Provider>
  );
}

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};
