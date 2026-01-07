"use client";

import { useCallback } from "react";

export function useHaptics() {
    const trigger = useCallback((pattern: number | number[] = 10) => {
        if (typeof window !== "undefined" && navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }, []);

    const medium = useCallback(() => trigger(20), [trigger]);
    const heavy = useCallback(() => trigger(40), [trigger]);
    const success = useCallback(() => trigger([10, 30, 10]), [trigger]);
    const error = useCallback(() => trigger([50, 30, 50]), [trigger]);

    return { trigger, medium, heavy, success, error };
}
