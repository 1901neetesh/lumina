"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { HapticFeedback } from "@/lib/haptics";

interface HapticButtonProps extends ButtonProps {
    hapticPattern?: "light" | "medium" | "heavy" | "success" | "error";
}

export default function HapticButton({
    children,
    onClick,
    hapticPattern = "medium",
    ...props
}: HapticButtonProps) {
    const handleInteraction = (e: React.MouseEvent<HTMLButtonElement>) => {
        HapticFeedback.trigger(hapticPattern);
        onClick?.(e);
    };

    return (
        <Button
            onClick={handleInteraction}
            {...props}
        >
            {children}
        </Button>
    );
}