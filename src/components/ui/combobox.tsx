import * as React from "react";
import { Combobox } from "@base-ui/react/combobox";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const ComboboxRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Combobox.Root> & { className?: string }
>(({ className, children, ...props }, ref) => (
  <Combobox.Root {...props}>
    <div ref={ref} className={cn("relative", className)}>
      {children}
    </div>
  </Combobox.Root>
));
ComboboxRoot.displayName = "ComboboxRoot";

const ComboboxInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<typeof Combobox.Input>
>(({ className, ...props }, ref) => (
  <Combobox.Input
    ref={ref}
    className={cn(
      "flex h-10 w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-sm",
      "placeholder:text-foreground/50",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
));
ComboboxInput.displayName = "ComboboxInput";

const ComboboxTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Combobox.Trigger>
>(({ className, ...props }, ref) => (
  <Combobox.Trigger
    ref={ref}
    className={cn(
      "absolute right-2 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center",
      "text-foreground/70 hover:text-foreground",
      className
    )}
    {...props}
  />
));
ComboboxTrigger.displayName = "ComboboxTrigger";

const ComboboxIcon = () => <ChevronDown className="h-4 w-4" />;

const ComboboxPortal = Combobox.Portal;

const ComboboxPositioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Combobox.Positioner>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <Combobox.Positioner
    ref={ref}
    sideOffset={sideOffset}
    className={cn("z-50", className)}
    {...props}
  />
));
ComboboxPositioner.displayName = "ComboboxPositioner";

const ComboboxPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Combobox.Popup>
>(({ className, ...props }, ref) => (
  <Combobox.Popup
    ref={ref}
    className={cn(
      "max-h-60 w-(--anchor-width) overflow-auto rounded-lg border border-foreground/20 bg-background p-1 shadow-md",
      "data-starting-style:opacity-0 data-starting-style:scale-95",
      "data-ending-style:opacity-0 data-ending-style:scale-95",
      "transition-[opacity,transform] duration-200 ease-out origin-(--transform-origin)",
      className
    )}
    {...props}
  />
));
ComboboxPopup.displayName = "ComboboxPopup";

const ComboboxStatus = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Combobox.Status>
>(({ className, ...props }, ref) => (
  <Combobox.Status
    ref={ref}
    className={cn("sr-only", className)}
    {...props}
  />
));
ComboboxStatus.displayName = "ComboboxStatus";

const ComboboxEmpty = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Combobox.Empty>
>(({ className, children, ...props }, ref) => (
  <Combobox.Empty
    ref={ref}
    className={cn("text-sm text-foreground/70", className)}
    {...props}
  >
    {children && <div className="px-2 py-1.5">{children}</div>}
  </Combobox.Empty>
));
ComboboxEmpty.displayName = "ComboboxEmpty";

const ComboboxList = Combobox.List;

const ComboboxItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Combobox.Item>
>(({ className, ...props }, ref) => (
  <Combobox.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
      "data-highlighted:bg-foreground/5 data-highlighted:text-foreground",
      "data-disabled:pointer-events-none data-disabled:opacity-50",
      className
    )}
    {...props}
  />
));
ComboboxItem.displayName = "ComboboxItem";

export {
  ComboboxRoot,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxIcon,
  ComboboxPortal,
  ComboboxPositioner,
  ComboboxPopup,
  ComboboxStatus,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
};
