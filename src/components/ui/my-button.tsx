import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "border rounded-md disabled:pointer-events-none disabled:opacity-50 flex items-center justify-center [&_svg]:size-4 transform text-sm hover:scale-105",
  {
    variants: {
      variant: {
        primary: "bg-primary hover:bg-primary/90 text-primary-foreground ",
        secondary:
          "bg-secondary hover:bg-secondary/90 text-secondary-foreground",
        ghost: "bg-muted hover:bg-muted/90 text-muted-foreground",
      },
      size: {
        sm: "px-2 py-2 h-7 ",
        md: "px-2 py-2 h-8",
        lg: "px-3 py-2 h-10 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface MyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const MyButton = React.forwardRef<HTMLButtonElement, MyButtonProps>(
  ({ variant, size, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={cn(className, buttonVariants({ variant, size }))}
      />
    );
  },
);

MyButton.displayName = "MyButton";
