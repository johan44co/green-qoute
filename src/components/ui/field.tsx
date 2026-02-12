import * as React from "react";
import { Field as BaseField } from "@base-ui/react/field";
import { cn } from "@/lib/utils";

// Field Root
export interface FieldRootProps
  extends React.ComponentPropsWithoutRef<typeof BaseField.Root> {}

const FieldRoot = React.forwardRef<HTMLDivElement, FieldRootProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseField.Root
        ref={ref}
        className={cn("space-y-2", className)}
        {...props}
      />
    );
  }
);
FieldRoot.displayName = "Field.Root";

// Field Label
export interface FieldLabelProps
  extends React.ComponentPropsWithoutRef<typeof BaseField.Label> {}

const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseField.Label
        ref={ref}
        className={cn(
          "text-sm font-medium leading-none",
          "data-disabled:cursor-not-allowed data-disabled:opacity-70",
          className
        )}
        {...props}
      />
    );
  }
);
FieldLabel.displayName = "Field.Label";

// Field Control (same as Input but integrated with Field)
export interface FieldControlProps
  extends React.ComponentPropsWithoutRef<typeof BaseField.Control> {}

const FieldControl = React.forwardRef<HTMLInputElement, FieldControlProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseField.Control
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm",
          "placeholder:text-foreground/50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-disabled:cursor-not-allowed data-disabled:opacity-50",
          "data-invalid:border-red-500 data-invalid:focus-visible:ring-red-500",
          className
        )}
        {...props}
      />
    );
  }
);
FieldControl.displayName = "Field.Control";

// Field Description
export interface FieldDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof BaseField.Description> {}

const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  FieldDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <BaseField.Description
      ref={ref}
      className={cn("text-sm text-foreground/60", className)}
      {...props}
    />
  );
});
FieldDescription.displayName = "Field.Description";

// Field Error
export interface FieldErrorProps
  extends React.ComponentPropsWithoutRef<typeof BaseField.Error> {}

const FieldError = React.forwardRef<HTMLDivElement, FieldErrorProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseField.Error
        ref={ref}
        className={cn("text-sm font-medium text-red-500", className)}
        {...props}
      />
    );
  }
);
FieldError.displayName = "Field.Error";

// Field Validity
export interface FieldValidityProps
  extends React.ComponentPropsWithoutRef<typeof BaseField.Validity> {}

const FieldValidity = BaseField.Validity;
FieldValidity.displayName = "Field.Validity";

// Export as compound component
export const Field = {
  Root: FieldRoot,
  Label: FieldLabel,
  Control: FieldControl,
  Description: FieldDescription,
  Error: FieldError,
  Validity: FieldValidity,
};
