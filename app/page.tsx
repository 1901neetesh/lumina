"use client";

import { Header } from "@/components/layout/Header";
import { Timer } from "@/components/chrono/Timer";
import { TaskManager } from "@/components/operations/TaskManager";
import { SoundMixer } from "@/components/audio/SoundMixer";
import { StyleGuide } from "@/components/lifestyle/StyleGuide";
import { MovementCore } from "@/components/lifestyle/MovementCore";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col bg-background text-foreground">
            <Header />

            <div className="flex-1 px-6 pb-6 lg:px-12 lg:pb-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT COLUMN - 7 cols */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    {/* CHRONO - Top */}
                    <div className="flex-[2] flex flex-col justify-center min-h-[400px]">
                        <Timer />
                    </div>

                    {/* MOVEMENT - Bottom */}
                    <div className="flex-1 rounded-xl bg-card border border-border p-6 relative overflow-hidden group min-h-[200px]">
                        <MovementCore />
                    </div>
                </div>

                {/* RIGHT COLUMN - 5 cols */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="h-1/3 rounded-xl bg-card border border-border p-6 relative overflow-hidden group">
                        <TaskManager />
                    </div>

                    <div className="h-1/3 rounded-xl bg-card border border-border p-6 relative overflow-hidden group">
                        <SoundMixer />
                    </div>

                    <div className="h-1/3 rounded-xl bg-card border border-border p-6 relative overflow-hidden group">
                        <StyleGuide />
                    </div>
                </div>
            </div>
        </main>
    );
}