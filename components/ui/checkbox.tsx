"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}

export function Checkbox({ className, checked, onCheckedChange, ...props }: CheckboxProps) {
    return (
        <div
            className={cn(
                "h-6 w-6 shrink-0 rounded border border-input ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hover:border-primary transition-colors cursor-pointer flex items-center justify-center",
                checked && "bg-primary text-primary-foreground border-primary",
                className
            )}
            onClick={() => onCheckedChange?.(!checked)}
        >
            {checked && <Check className="h-4 w-4" />}
            <input
                type="checkbox"
                className="hidden"
                checked={checked}
                onChange={(e) => onCheckedChange?.(e.target.checked)}
                {...props}
            />
        </div>
    );
}
