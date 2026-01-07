"use client";

import { useState, useEffect, useRef } from "react";

export type TimerMode = "FOCUS" | "BREAK";

export function useTimer() {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<TimerMode>("FOCUS");
    const [progress, setProgress] = useState(100);

    const endTimeRef = useRef<number | null>(null);
    const initialDurationRef = useRef(25 * 60);
    const rafRef = useRef<number | null>(null);
    const tickRef = useRef<() => void>(() => { });

    const loop = () => {
        tickRef.current();
    };

    useEffect(() => {
        tickRef.current = () => {
            if (!endTimeRef.current) return;

            const now = Date.now();
            const remaining = Math.ceil((endTimeRef.current - now) / 1000);

            if (remaining <= 0) {
                setTimeLeft(0);
                setIsActive(false);
                setProgress(0);
                if (rafRef.current) {
                    cancelAnimationFrame(rafRef.current);
                    rafRef.current = null;
                }
                return;
            }

            setTimeLeft(remaining);
            setProgress((remaining / initialDurationRef.current) * 100);

            rafRef.current = requestAnimationFrame(loop);
        };
    }, []); // tick logic doesn't strictly depend on changing state if we use refs for duration

    useEffect(() => {
        if (isActive && !rafRef.current) {
            rafRef.current = requestAnimationFrame(loop);
        }
        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };
    }, [isActive]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleTimer = () => {
        if (isActive) {
            setIsActive(false);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
            // Pause logic: clear endTime so we can calc new endTime on resume
            endTimeRef.current = null;
        } else {
            // Resume logic:
            // Set new endTime based on current timeLeft
            const now = Date.now();
            endTimeRef.current = now + (timeLeft * 1000);

            // Update initial duration only if starting fresh? 
            // Acts as base for progress bar. If pausing/resuming, progress should scale to original or remaining? 
            // Standard is scale to original total.
            if (timeLeft === (mode === "FOCUS" ? 25 * 60 : 5 * 60)) {
                initialDurationRef.current = timeLeft;
            }

            setIsActive(true);
        }
    };

    const resetTimer = () => {
        setIsActive(false);
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        const newTime = mode === "FOCUS" ? 25 * 60 : 5 * 60;
        setTimeLeft(newTime);
        initialDurationRef.current = newTime;
        setProgress(100);
        endTimeRef.current = null;
    };

    const switchMode = () => {
        const newMode = mode === "FOCUS" ? "BREAK" : "FOCUS";
        setMode(newMode);
        setIsActive(false);
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        const newTime = newMode === "FOCUS" ? 25 * 60 : 5 * 60;
        setTimeLeft(newTime);
        initialDurationRef.current = newTime;
        setProgress(100);
        endTimeRef.current = null;
    };

    return {
        timeLeft: formatTime(timeLeft),
        progress,
        isActive,
        mode,
        toggleTimer,
        resetTimer,
        switchMode
    };
}
