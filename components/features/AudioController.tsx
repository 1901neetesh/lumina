"use client";

import { useState, useEffect, useRef } from "react";
import { Waves, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AudioController() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);

    useEffect(() => {
        return () => {
            if (audioCtxRef.current) {
                audioCtxRef.current.close();
            }
        };
    }, []);

    const toggleAudio = () => {
        if (!isPlaying) {
            startBrownNoise();
        } else {
            stopAudio();
        }
        setIsPlaying(!isPlaying);
    };

    const startBrownNoise = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        const ctx = audioCtxRef.current;
        const bufferSize = 4096;
        const brownNoise = ctx.createScriptProcessor(bufferSize, 1, 1);

        brownNoise.onaudioprocess = function (e) {
            const output = e.outputBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = output[i];
                output[i] *= 3.5; // (roughly) compensate for gain
            }
        };

        let lastOut = 0;
        const gainNode = ctx.createGain();
        gainNode.gain.value = volume * 0.1; // Lower base volume for ambience

        brownNoise.connect(gainNode);
        gainNode.connect(ctx.destination);

        gainNodeRef.current = gainNode;
    };

    const stopAudio = () => {
        audioCtxRef.current?.close();
        audioCtxRef.current = null;
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2">
            <AnimatePresence>
                {isPlaying && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-black/80 backdrop-blur-md border border-white/10 rounded-full p-2 mb-2"
                    >
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={(e) => {
                                const v = parseFloat(e.target.value);
                                setVolume(v);
                                if (gainNodeRef.current) gainNodeRef.current.gain.value = v * 0.1;
                            }}
                            className="w-24 accent-brand-neon h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={toggleAudio}
                className={`p-4 rounded-full transition-all duration-300 ${isPlaying
                        ? "bg-brand-neon text-black shadow-[0_0_30px_rgba(0,255,156,0.4)]"
                        : "bg-black/40 text-white/40 border border-white/10 hover:border-white/30 hover:text-white"
                    }`}
            >
                {isPlaying ? <Waves className="animate-pulse" /> : <Volume2 />}
            </button>
        </div>
    );
}
