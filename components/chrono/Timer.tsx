"use client";

import { Play, Pause, RefreshCw } from "lucide-react";
import { useTimer } from "@/lib/timer-store";
import { useHaptics } from "@/hooks/use-haptics";
import { cn } from "@/lib/utils";

export function Timer() {
    const { timeLeft, progress, isActive, mode, toggleTimer, resetTimer, switchMode } = useTimer();
    const { medium, heavy } = useHaptics();

    const handleToggle = () => {
        medium();
        toggleTimer();
    };

    const handleReset = () => {
        heavy();
        resetTimer();
    };

    const handleModeSwitch = () => {
        medium();
        switchMode();
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full relative group">
            {/* Background glow integration could go here */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-20 pointer-events-none rounded-3xl" />

            {/* Mode Indicator */}
            <button
                onClick={handleModeSwitch}
                className="mb-8 px-4 py-1 rounded-full border border-border text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary hover:border-primary transition-all"
            >
                {mode} MODE
            </button>

            {/* Main Time Display */}
            <div className="relative z-10 font-oswald text-[12rem] lg:text-[16rem] leading-none tracking-tighter text-foreground tabular-nums select-none mix-blend-difference">
                {timeLeft}
            </div>

            {/* Progress Bar (Minimal) */}
            <div className="w-64 h-1 bg-secondary mt-8 rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-8 mt-12 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={handleReset}
                    className="p-4 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                    <RefreshCw className="w-6 h-6" />
                </button>

                <button
                    onClick={handleToggle}
                    className={cn(
                        "p-8 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95",
                        isActive ? "bg-secondary text-foreground" : "bg-primary text-primary-foreground"
                    )}
                >
                    {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
                </button>
            </div>
        </div>
    );
}
