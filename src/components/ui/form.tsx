import * as React from "react";
import { Form as BaseForm } from "@base-ui/react/form";
import { cn } from "@/lib/utils";

export interface FormProps
  extends React.ComponentPropsWithoutRef<typeof BaseForm> {}

export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseForm
        ref={ref}
        className={cn("space-y-6", className)}
        {...props}
      />
    );
  }
);

Form.displayName = "Form";
