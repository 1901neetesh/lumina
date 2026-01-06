"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceInputProps {
    onResult: (text: string) => void;
    isListening?: boolean;
}

export default function VoiceInput({ onResult }: VoiceInputProps) {
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && (window as any).webkitSpeechRecognition) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition;
            const rec = new SpeechRecognition();
            rec.continuous = false;
            rec.interimResults = false;
            rec.lang = "en-US";

            rec.onstart = () => setIsListening(true);
            rec.onend = () => setIsListening(false);
            rec.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                console.log("Voice result:", transcript);
                onResult(transcript);
            };

            setRecognition(rec);
        }
    }, [onResult]);

    const toggleListening = () => {
        if (!recognition) return;

        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }
    };

    if (!recognition) return null; // Hide if not supported

    return (
        <div className="relative inline-flex">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleListening}
                className={`p-4 rounded-full border transition-all duration-300 ${isListening
                        ? "bg-brand-neon text-black border-brand-neon shadow-[0_0_20px_rgba(0,255,156,0.5)]"
                        : "bg-black/50 text-white/50 border-white/10 hover:border-brand-neon/50 hover:text-brand-neon"
                    }`}
            >
                {isListening ? <Mic size={24} className="animate-pulse" /> : <MicOff size={24} />}
            </motion.button>

            <AnimatePresence>
                {isListening && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-black border border-brand-neon/30 px-3 py-1 rounded-full whitespace-nowrap"
                    >
                        <span className="text-[10px] font-mono text-brand-neon uppercase tracking-widest animate-pulse">Listening...</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
