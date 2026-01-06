"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HistoryItem, getHistory } from "@/lib/history";
import { X, Clock, ChevronRight } from "lucide-react";
import { HapticFeedback } from "@/lib/haptics";

interface HistoryDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HistoryDrawer({ isOpen, onClose }: HistoryDrawerProps) {
    const handleClose = () => {
        HapticFeedback.trigger("light");
        onClose();
    };
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        if (isOpen) {
            setHistory(getHistory());
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 20 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0a0a0a] border-l border-white/10 z-50 p-4 sm:p-6 overflow-y-auto shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-6 sm:mb-8">
                            <h2 className="text-xl sm:text-2xl font-heading font-black uppercase text-white tracking-tight">
                                Archives
                            </h2>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                            >
                                <X size={20} className="sm:w-6 sm:h-6" />
                            </button>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            {history.length === 0 ? (
                                <p className="text-neutral-500 font-mono text-center py-8 sm:py-10">No archives found.</p>
                            ) : (
                                history.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white/5 border border-white/10 p-3 sm:p-4 rounded-lg sm:rounded-xl hover:bg-white/10 transition-colors group cursor-default"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-heading font-bold text-white uppercase text-base sm:text-lg">
                                                {item.recommendation.exercise.title}
                                            </span>
                                            <span className="text-[8px] sm:text-[10px] font-mono text-white/40 flex items-center gap-1">
                                                <Clock size={8} className="sm:w-2.5 sm:h-2.5" />
                                                {new Date(item.timestamp).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-brand-neon font-mono text-xs mb-3">
                                            <span className="bg-brand-neon/10 px-2 py-1 rounded">
                                                {item.recommendation.fashion.styleName}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
