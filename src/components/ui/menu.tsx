import * as React from "react";
import { Menu } from "@base-ui/react/menu";
import { cn } from "@/lib/utils";

const MenuRoot = Menu.Root;

const MenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Menu.Trigger>
>(({ className, ...props }, ref) => (
  <Menu.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-popup-open:bg-accent data-popup-open:text-accent-foreground",
      className
    )}
    {...props}
  />
));
MenuTrigger.displayName = "MenuTrigger";

const MenuPortal = Menu.Portal;

const MenuPositioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Menu.Positioner>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <Menu.Positioner
    ref={ref}
    sideOffset={sideOffset}
    className={cn("z-50", className)}
    {...props}
  />
));
MenuPositioner.displayName = "MenuPositioner";

const MenuPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Menu.Popup>
>(({ className, ...props }, ref) => (
  <Menu.Popup
    ref={ref}
    className={cn(
      "min-w-32 overflow-hidden rounded-lg border border-foreground/20 bg-background p-1 text-foreground shadow-md",
      "data-starting-style:opacity-0",
      "data-ending-style:opacity-0",
      "transition-opacity duration-200 ease-out",
      className
    )}
    {...props}
  />
));
MenuPopup.displayName = "MenuPopup";

const MenuItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Menu.Item>
>(({ className, ...props }, ref) => (
  <Menu.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
      "data-highlighted:bg-foreground/5 data-highlighted:text-foreground",
      "data-disabled:pointer-events-none data-disabled:opacity-50",
      className
    )}
    {...props}
  />
));
MenuItem.displayName = "MenuItem";

const MenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Menu.Separator>
>(({ className, ...props }, ref) => (
  <Menu.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-foreground/20", className)}
    {...props}
  />
));
MenuSeparator.displayName = "MenuSeparator";

const MenuGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Menu.Group>
>(({ className, ...props }, ref) => (
  <Menu.Group ref={ref} className={cn("", className)} {...props} />
));
MenuGroup.displayName = "MenuGroup";

const MenuGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Menu.GroupLabel>
>(({ className, ...props }, ref) => (
  <Menu.GroupLabel
    ref={ref}
    className={cn("px-2 py-1.5 text-xs font-semibold text-foreground/70", className)}
    {...props}
  />
));
MenuGroupLabel.displayName = "MenuGroupLabel";

const MenuCheckboxItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Menu.CheckboxItem>
>(({ className, ...props }, ref) => (
  <Menu.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-2 rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors",
      "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
      "data-disabled:pointer-events-none data-disabled:opacity-50",
      className
    )}
    {...props}
  />
));
MenuCheckboxItem.displayName = "MenuCheckboxItem";

const MenuCheckboxItemIndicator = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof Menu.CheckboxItemIndicator>
>(({ className, children, ...props }, ref) => (
  <Menu.CheckboxItemIndicator
    ref={ref}
    className={cn(
      "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
      className
    )}
    {...props}
  >
    {children || <span className="text-xs">✓</span>}
  </Menu.CheckboxItemIndicator>
));
MenuCheckboxItemIndicator.displayName = "MenuCheckboxItemIndicator";

const MenuRadioGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Menu.RadioGroup>
>(({ className, ...props }, ref) => (
  <Menu.RadioGroup ref={ref} className={cn("", className)} {...props} />
));
MenuRadioGroup.displayName = "MenuRadioGroup";

const MenuRadioItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Menu.RadioItem>
>(({ className, ...props }, ref) => (
  <Menu.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-2 rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors",
      "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
      "data-disabled:pointer-events-none data-disabled:opacity-50",
      className
    )}
    {...props}
  />
));
MenuRadioItem.displayName = "MenuRadioItem";

const MenuRadioItemIndicator = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof Menu.RadioItemIndicator>
>(({ className, children, ...props }, ref) => (
  <Menu.RadioItemIndicator
    ref={ref}
    className={cn(
      "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
      className
    )}
    {...props}
  >
    {children || <span className="text-xs">●</span>}
  </Menu.RadioItemIndicator>
));
MenuRadioItemIndicator.displayName = "MenuRadioItemIndicator";

const MenuSubmenuRoot = Menu.SubmenuRoot;

const MenuSubmenuTrigger = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Menu.SubmenuTrigger>
>(({ className, ...props }, ref) => (
  <Menu.SubmenuTrigger
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
      "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
      "data-disabled:pointer-events-none data-disabled:opacity-50",
      className
    )}
    {...props}
  />
));
MenuSubmenuTrigger.displayName = "MenuSubmenuTrigger";

export {
  MenuRoot,
  MenuTrigger,
  MenuPortal,
  MenuPositioner,
  MenuPopup,
  MenuItem,
  MenuSeparator,
  MenuGroup,
  MenuGroupLabel,
  MenuCheckboxItem,
  MenuCheckboxItemIndicator,
  MenuRadioGroup,
  MenuRadioItem,
  MenuRadioItemIndicator,
  MenuSubmenuRoot,
  MenuSubmenuTrigger,
};
