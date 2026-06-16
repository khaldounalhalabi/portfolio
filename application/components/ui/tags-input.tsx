"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { KeyboardEvent, useState } from "react";

interface TagsInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

const TagsInput = ({
  value,
  onChange,
  placeholder,
  className,
}: TagsInputProps) => {
  const [input, setInput] = useState("");

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && input === "") {
      removeTag(value.length - 1);
    }
  };

  return (
    <div
      className={cn(
        "flex min-h-10 flex-wrap items-center gap-1.5 rounded-md border px-2 py-1.5",
        className,
      )}
    >
      {value &&
        value?.map?.((tag, i) => (
          <Badge key={i} variant="secondary" className="gap-1">
            {tag}
            <button type="button" onClick={() => removeTag(i)}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      <input
        className="min-w-20 flex-1 bg-transparent text-sm outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => input.trim() && addTag()}
        placeholder={
          value.length === 0 ? (placeholder ?? "Type and press Enter...") : ""
        }
      />
    </div>
  );
};

export default TagsInput;
