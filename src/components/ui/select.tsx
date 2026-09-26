import { Check, ChevronDown } from "lucide-react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import type { ComponentProps } from "react";

import { cn } from "cn";

export function Select(props: ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root {...props} />;
}

export function SelectTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-[#dce3ec] bg-white px-4 text-sm font-medium text-[#59667e] outline-none transition-colors",
        "hover:bg-[#f7f9fc] focus-visible:border-[#b9c9e8] focus-visible:ring-2 focus-visible:ring-[#2864f0]/10",
        "data-[popup-open]:border-[#b9c9e8] data-[popup-open]:ring-2 data-[popup-open]:ring-[#2864f0]/10",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon className="shrink-0 text-[#71809a]">
        <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[popup-open]:rotate-180" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectValue({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Value>) {
  return (
    <SelectPrimitive.Value className={cn("truncate", className)} {...props} />
  );
}

export function SelectContent({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Popup>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        sideOffset={6}
        alignItemWithTrigger={false}
        className="z-[100]"
      >
        <SelectPrimitive.Popup
          className={cn(
            "min-w-[var(--anchor-width)] overflow-hidden rounded-xl border border-[#dce3ec] bg-white p-1.5 shadow-[0_12px_30px_rgba(20,35,60,0.14)] outline-none",
            "data-[starting-style]:animate-in data-[ending-style]:animate-out",
            className,
          )}
          {...props}
        >
          {children}
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm text-[#334057] outline-none transition-colors",
        "data-[highlighted]:bg-[#eef4ff] data-[highlighted]:text-[#1e55d9]",
        "data-[selected]:font-semibold",
        className,
      )}
      {...props}
    >
      <span className="mr-2 flex h-4 w-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-3.5 w-3.5 text-[#2864f0]" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

export function SelectGroup({
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group {...props}>{children}</SelectPrimitive.Group>;
}
