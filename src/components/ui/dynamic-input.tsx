"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface EditableTextProps {
  initialValue: string;
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
  onSave: (newValue: string) => void;
  className?: string;
  inputClassName?: string;
}

export function DynamicInput({
  initialValue,
  as: Element,
  onSave,
  className = "",
  inputClassName = "",
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      onSave(value);
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setValue(initialValue);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    onSave(value);
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={`mt-1 ${inputClassName}`}
        aria-label={`Edit ${Element}`}
      />
    );
  }

  console.log({ value });

  return (
    <Element
      onClick={handleClick}
      className={`cursor-pointer rounded border bg-gray-100 px-2 py-1 ${className}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      aria-label={`Click to edit ${Element}`}
    >
      {value}
    </Element>
  );
}
