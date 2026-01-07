"use client";

import { Activity, Flame, MoveRight } from "lucide-react";

export function MovementCore() {
    return (
        <div className="h-full flex flex-col justify-between relative">
            <div className="absolute top-0 right-0 p-2 bg-primary text-primary-foreground rounded-bl-xl text-xs font-bold uppercase tracking-wider">
                Today
            </div>

            <h2 className="text-xl font-oswald text-muted-foreground mb-4 uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-4 h-4" /> Movement
            </h2>

            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                <div className="h-24 w-24 rounded-full border-4 border-secondary flex items-center justify-center relative">
                    <Flame className="w-8 h-8 text-primary absolute animate-pulse-slow" />
                    <svg className="w-full h-full -rotate-90">
                        <circle
                            cx="48" cy="48" r="44"
                            className="fill-none stroke-primary stroke-[4]"
                            strokeDasharray="276"
                            strokeDashoffset="100"
                        />
                    </svg>
                </div>

                <div>
                    <div className="text-2xl font-oswald text-foreground">HIIT BLAST</div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wide">20 MIN • INTENSE</div>
                </div>
            </div>

            <button className="w-full py-3 bg-secondary/50 hover:bg-primary hover:text-primary-foreground rounded-lg uppercase text-xs font-bold tracking-widest transition-all flex items-center justify-center gap-2 group">
                Start Session <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
}
