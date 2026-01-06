"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface HapticButtonProps extends HTMLMotionProps<"button"> {
    hapticPattern?: number | number[];
}

export default function HapticButton({
    className,
    children,
    onClick,
    hapticPattern = 10, // Default short tick
    ...props
}: HapticButtonProps & { children?: React.ReactNode }) { // Explicitly type children here
    const handleInteraction = (e: React.MouseEvent<HTMLButtonElement>) => {
        // Trigger haptics if available
        if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate(hapticPattern);
        }

        // Call original onClick
        onClick?.(e);
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleInteraction}
            className={cn(
                "relative overflow-hidden bg-brand-dark border-2 border-white/20 px-8 py-4 transition-all duration-200",
                "hover:border-brand-neon hover:bg-brand-neon/10 hover:shadow-[4px_4px_0px_0px_rgba(223,255,0,1)] hover:-translate-y-1 hover:-translate-x-1",
                "active:translate-y-0 active:translate-x-0 active:shadow-none",
                "text-white font-heading font-black tracking-widest uppercase text-sm md:text-base",
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
