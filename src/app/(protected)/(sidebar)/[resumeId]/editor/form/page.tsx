"use client";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useState } from "react";

export default function FormPage() {
  const [content, setContent] = useState("");

  return <RichTextEditor content={content} onValueChange={setContent} />;
}
