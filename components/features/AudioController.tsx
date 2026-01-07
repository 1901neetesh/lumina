"use client";

import { useState, useEffect, useRef } from "react";
import { Waves, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";

export default function AudioController() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState([0.5]);
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
                output[i] *= 3.5;
            }
        };

        let lastOut = 0;
        const gainNode = ctx.createGain();
        gainNode.gain.value = volume[0] * 0.1;

        brownNoise.connect(gainNode);
        gainNode.connect(ctx.destination);

        gainNodeRef.current = gainNode;
    };

    const stopAudio = () => {
        audioCtxRef.current?.close();
        audioCtxRef.current = null;
    };

    const handleVolumeChange = (values: number[]) => {
        setVolume(values);
        if (gainNodeRef.current) gainNodeRef.current.gain.value = values[0] * 0.1;
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2">
            {isPlaying && (
                <Card className="w-32">
                    <CardContent className="p-4">
                        <Slider
                            value={volume}
                            onValueChange={handleVolumeChange}
                            max={1}
                            step={0.1}
                            min={0}
                        />
                    </CardContent>
                </Card>
            )}

            <Button
                onClick={toggleAudio}
                variant={isPlaying ? "default" : "outline"}
                size="icon"
                className="rounded-full"
            >
                {isPlaying ? <Waves className="animate-pulse" /> : <Volume2 />}
            </Button>
        </div>
    );
}