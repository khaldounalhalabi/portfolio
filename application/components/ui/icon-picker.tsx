"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { DynamicIcon, iconNames } from "lucide-react/dynamic";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";

const ROW_HEIGHT = 40;
const LIST_HEIGHT = 288; // h-72 = 18rem = 288px

interface IconPickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const IconPicker = ({
  value,
  onChange,
  placeholder = "Select an icon",
  disabled,
}: IconPickerProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const parentRef = useRef<HTMLDivElement>(null);

  const filteredIcons = useMemo(() => {
    if (!search.trim()) return iconNames;
    const query = search.toLowerCase();
    return iconNames.filter((name) => name.toLowerCase().includes(query));
  }, [search]);

  const virtualizer = useVirtualizer({
    count: filteredIcons.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  // Store virtualizer in a ref so we can call measure() in effects
  // without adding virtualizer to dependency arrays
  const virtualizerRef = useRef(virtualizer);
  virtualizerRef.current = virtualizer;

  // Force virtualizer to remeasure when popover opens.
  // The container transitions from display:none to visible,
  // so ResizeObserver needs a nudge to pick up the new dimensions.
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      virtualizerRef.current.measure();
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  // Scroll to selected item when opening
  useLayoutEffect(() => {
    if (!open || !value) return;
    const index = (filteredIcons as unknown as string[]).indexOf(value);
    if (index !== -1) {
      virtualizerRef.current.scrollToIndex(index, { align: "center" });
    }
  }, [open, value, filteredIcons]);

  const handleSelect = (iconName: string) => {
    onChange?.(iconName);
    setOpen(false);
    setSearch("");
  };

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "h-auto min-h-9 w-full justify-between px-3 py-2",
            !value && "text-muted-foreground",
          )}
        >
          {value ? (
            <span className="flex items-center gap-2">
              <span className="flex size-4 items-center justify-center">
                <DynamicIcon name={value as any} className="size-4 shrink-0" />
              </span>
              {value}
            </span>
          ) : (
            placeholder
          )}
          <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="start">
        <div className="flex flex-col gap-1.5">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search icons..."
              value={search}
              onChange={(e) => {
                startTransition(() => {
                  setSearch(e.target.value);
                });
              }}
              className={cn(
                "w-full rounded-md border border-input bg-background py-2 pr-8 pl-8 text-sm ring-offset-background outline-hidden transition-colors",
                "placeholder:text-muted-foreground",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              )}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Virtualized list — fixed-size items, no measureElement needed */}
          <div
            ref={parentRef}
            className="relative overflow-y-auto overscroll-contain rounded-md border"
            style={{ height: LIST_HEIGHT }}
          >
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {virtualItems.map((virtualItem) => {
                const iconName = filteredIcons[virtualItem.index];
                const isSelected = iconName === value;

                return (
                  <button
                    key={virtualItem.key}
                    type="button"
                    onClick={() => handleSelect(iconName)}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${ROW_HEIGHT}px`,
                      transform: `translateY(${virtualItem.start}px)`,
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 px-2 py-1.5 text-sm transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      "focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-hidden",
                      isSelected && "bg-accent text-accent-foreground",
                    )}
                  >
                    <span className="flex size-4 shrink-0 items-center justify-center">
                      {isSelected ? (
                        <Check className="size-4" />
                      ) : (
                        <DynamicIcon
                          name={iconName}
                          className="size-4 shrink-0"
                        />
                      )}
                    </span>
                    <span className="flex-1 truncate text-left">
                      {iconName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="px-0.5 text-xs text-muted-foreground">
            {filteredIcons.length} of {iconNames.length} icons
            {isPending && " (filtering...)"}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { IconPicker };
