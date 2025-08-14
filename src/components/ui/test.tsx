import { cn } from "@/lib/utils";
import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";

const textVariants = cva("", {
  variants: {},
  defaultVariants: {},
});

interface TextInterface
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textVariants> {
  field: string;
}

const Text = React.forwardRef<HTMLTextAreaElement, TextInterface>(
  ({ className, field, ...props }, ref) => {
    return (
      <textarea
        className={cn(className, textVariants())}
        ref={ref}
        {...props}
        defaultValue={field}
      />
    );
  },
);

Text.displayName = "Text";
