import * as React from "react";
import { Input as BaseInput } from "@base-ui/react/input";
import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentPropsWithoutRef<
  typeof BaseInput
> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <BaseInput
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm",
          "placeholder:text-foreground/50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-disabled:cursor-not-allowed data-disabled:opacity-50",
          "data-invalid:border-red-500 data-invalid:focus-visible:ring-red-500",
          error && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
