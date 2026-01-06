"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { HapticFeedback } from "@/lib/haptics";

interface HapticButtonProps extends HTMLMotionProps<"button"> {
    hapticPattern?: "light" | "medium" | "heavy" | "success" | "error";
}

export default function HapticButton({
    className,
    children,
    onClick,
    hapticPattern = "medium", // Default haptic pattern
    ...props
}: HapticButtonProps & { children?: React.ReactNode }) {
    const handleInteraction = (e: React.MouseEvent<HTMLButtonElement>) => {
        // Trigger haptics
        HapticFeedback.trigger(hapticPattern);

        // Call original onClick
        onClick?.(e);
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleInteraction}
            className={cn(
                "relative overflow-hidden bg-brand-dark border-2 border-white/20 px-6 py-3 sm:px-8 sm:py-4 transition-all duration-200",
                "hover:border-brand-neon hover:bg-brand-neon/10 hover:shadow-[4px_4px_0px_0px_rgba(223,255,0,1)] hover:-translate-y-1 hover:-translate-x-1",
                "active:translate-y-0 active:translate-x-0 active:shadow-none",
                "text-white font-heading font-black tracking-widest uppercase text-sm sm:text-base min-h-[44px] sm:min-h-[48px]",
                className
            )}
            {...props}
        >
            <div className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </div>
            <div className="absolute inset-0 bg-brand-neon/20 skew-x-12 translate-x-full hover:animate-[shimmer_1s_infinite]" />
        </motion.button>
    );
}