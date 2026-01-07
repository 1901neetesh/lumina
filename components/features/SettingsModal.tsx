"use client";

import { Smartphone, Volume2, Palette } from "lucide-react";
import { HapticFeedback } from "@/lib/haptics";
import { useTheme, Theme } from "@/lib/theme";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: { haptics: boolean; audio: boolean };
    onToggle: (key: "haptics" | "audio") => void;
}

const themes: { value: Theme; label: string; color: string }[] = [
    { value: 'neon', label: 'Neon', color: '#00FF9C' },
    { value: 'warm', label: 'Warm', color: '#FF6B6B' },
    { value: 'cool', label: 'Cool', color: '#00BFFF' },
    { value: 'vibrant', label: 'Vibrant', color: '#9C27B0' },
];

export default function SettingsModal({ isOpen, onClose, settings, onToggle }: SettingsModalProps) {
    const { theme, setTheme } = useTheme();

    const handleToggle = (key: "haptics" | "audio") => {
        HapticFeedback.trigger("light");
        onToggle(key);
    };

    const handleThemeChange = (newTheme: Theme) => {
        HapticFeedback.trigger("light");
        setTheme(newTheme);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-black border-white/10 text-white max-w-sm">
                <DialogHeader>
                    <DialogTitle className="font-heading font-black text-xl uppercase tracking-tighter">
                        System Config
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                            <Smartphone className="text-primary w-5 h-5" />
                            <div>
                                <p className="font-bold">Haptic Feedback</p>
                                <p className="text-sm text-muted-foreground">Vibration response</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggle("haptics")}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.haptics ? "bg-primary" : "bg-muted"}`}
                        >
                            <div
                                className={`absolute top-1 left-1 w-4 h-4 bg-background rounded-full shadow-sm transition-transform ${
                                    settings.haptics ? "translate-x-5" : "translate-x-0"
                                }`}
                            />
                        </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                            <Volume2 className="text-primary w-5 h-5" />
                            <div>
                                <p className="font-bold">Sound Effects</p>
                                <p className="text-sm text-muted-foreground">UI interactions</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggle("audio")}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.audio ? "bg-primary" : "bg-muted"}`}
                        >
                            <div
                                className={`absolute top-1 left-1 w-4 h-4 bg-background rounded-full shadow-sm transition-transform ${
                                    settings.audio ? "translate-x-5" : "translate-x-0"
                                }`}
                            />
                        </Button>
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3 mb-3">
                            <Palette className="text-primary w-5 h-5" />
                            <div>
                                <p className="font-bold">Theme</p>
                                <p className="text-sm text-muted-foreground">Color scheme</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {themes.map((t) => (
                                <Button
                                    key={t.value}
                                    variant={theme === t.value ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleThemeChange(t.value)}
                                    className="justify-start"
                                >
                                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: t.color }} />
                                    {t.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                <p className="text-xs text-center text-muted-foreground font-mono mt-6">
                    LUMINA OS v2.0.4. BUILD 2024
                </p>
            </DialogContent>
        </Dialog>
    );
}