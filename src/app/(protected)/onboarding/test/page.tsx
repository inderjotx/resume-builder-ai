import React from "react";
import { MyButton } from "@/components/ui/my-button";

export default function page() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <MyButton size={"sm"} variant={"primary"}>
        Panda
      </MyButton>
      <MyButton size={"md"} variant={"secondary"}>
        Panda
      </MyButton>
      <MyButton size={"lg"} variant={"ghost"}>
        Panda
      </MyButton>
    </div>
  );
}
