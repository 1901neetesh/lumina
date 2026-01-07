"use client";

import { motion } from "framer-motion";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HapticFeedback } from "@/lib/haptics";

interface HapticButtonProps extends ButtonProps {
    hapticPattern?: "light" | "medium" | "heavy" | "success" | "error";
}

export default function HapticButton({
    className,
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
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <Button
                onClick={handleInteraction}
                className={cn(
                    "relative overflow-hidden bg-black border-2 border-white/20 hover:border-primary hover:bg-primary/10 hover:shadow-[4px_4px_0px_0px_hsl(var(--primary))]",
                    "text-white font-heading font-black tracking-widest uppercase min-h-[48px] sm:min-h-[52px]",
                    "transition-all duration-200",
                    className
                )}
                {...props}
            >
                <div className="relative z-10 flex items-center justify-center gap-2">
                    {children}
                </div>
                <div className="absolute inset-0 bg-primary/20 skew-x-12 translate-x-full group-hover:animate-[shimmer_1s_infinite]" />
            </Button>
        </motion.div>
    );
}