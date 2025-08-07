"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface EditableTextProps {
  value: string;
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
  onValueChange: (newValue: string) => void;
  className?: string;
  inputClassName?: string;
}

export function DynamicInput({
  value,
  as: Element,
  onValueChange,
  className = "",
  inputClassName = "",
}: EditableTextProps) {
  const [internalValue, setInternalValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleClick = (
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   onValueChange(e.target.value);
  // };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      onValueChange(internalValue);
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={`mt-1 ${inputClassName}`}
        aria-label={`Edit ${Element}`}
      />
    );
  }

  return (
    <Element
      onClick={handleClick}
      className={`cursor-pointer rounded border bg-gray-100 px-2 py-1 ${className}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && setIsEditing(true)}
      aria-label={`Click to edit ${Element}`}
    >
      {internalValue}
    </Element>
  );
}
