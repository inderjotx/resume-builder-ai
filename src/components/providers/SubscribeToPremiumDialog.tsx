"use client";
import { SubscribePremiumDialog } from "@/components/subscribe-premium-dialog";
import { useState, createContext, useContext } from "react";

const SubscribeToPremiumDialogContext = createContext({
  open: false,
  // @ts-ignore
  setValue: (value: boolean) => {},
});

export const SubscribeToPremiumDialogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  const setValue = (value: boolean) => {
    setOpen(value);
  };

  return (
    <SubscribeToPremiumDialogContext.Provider value={{ open, setValue }}>
      {children}
      <SubscribePremiumDialog />
    </SubscribeToPremiumDialogContext.Provider>
  );
};

export const useSubscribeToPremiumDialog = () => {
  const data = useContext(SubscribeToPremiumDialogContext);

  if (!data) {
    throw new Error(
      "useSubscribeToPremiumDialog must be used within a SubscribeToPremiumDialogProvider ",
    );
  }

  return data;
};
