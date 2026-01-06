"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, Volume2 } from "lucide-react";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: { haptics: boolean; audio: boolean };
    onToggle: (key: "haptics" | "audio") => void;
}

export default function SettingsModal({ isOpen, onClose, settings, onToggle }: SettingsModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-[#050505] border border-white/10 p-6 rounded-3xl z-50 shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-heading font-black text-2xl uppercase tracking-tighter">System Config</h2>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <Smartphone className="text-brand-neon" size={20} />
                                    <div>
                                        <p className="font-bold text-sm">Haptic Feedback</p>
                                        <p className="text-xs text-neutral-500">Vibration response</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onToggle("haptics")}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${settings.haptics ? "bg-brand-neon" : "bg-white/10"}`}
                                >
                                    <motion.div
                                        animate={{ x: settings.haptics ? 26 : 2 }}
                                        className="absolute top-1 left-0 w-4 h-4 bg-black rounded-full shadow-sm"
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <Volume2 className="text-brand-neon" size={20} />
                                    <div>
                                        <p className="font-bold text-sm">Sound Effects</p>
                                        <p className="text-xs text-neutral-500">UI interactions</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onToggle("audio")}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${settings.audio ? "bg-brand-neon" : "bg-white/10"}`}
                                >
                                    <motion.div
                                        animate={{ x: settings.audio ? 26 : 2 }}
                                        className="absolute top-1 left-0 w-4 h-4 bg-black rounded-full shadow-sm"
                                    />
                                </button>
                            </div>
                        </div>

                        <p className="mt-8 text-[10px] text-center text-neutral-600 font-mono">
                            LUMINA OS v2.0.4. BUILD 2024
                        </p>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
