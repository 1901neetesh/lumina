"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { HapticFeedback } from "@/lib/haptics";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface VoiceInputProps {
    onResult: (text: string) => void;
}

export default function VoiceInput({ onResult }: VoiceInputProps) {
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
            const SpeechRecognitionConstructor = (window as any).webkitSpeechRecognition;
            const rec = new SpeechRecognitionConstructor();
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

            const recognitionInstance = rec;
            setRecognition(recognitionInstance);
        }
    }, [onResult]);

    const toggleListening = () => {
        if (!recognition) return;

        HapticFeedback.trigger("light");

        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }
    };

    if (!recognition) return null;

    return (
        <Button
            onClick={toggleListening}
            variant={isListening ? "default" : "outline"}
            size="icon"
            className="rounded-full"
        >
            {isListening ? <Mic className="animate-pulse" /> : <MicOff />}
        </Button>
    );
}