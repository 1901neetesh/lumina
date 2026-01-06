"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, ExternalLink, Calendar, Info } from "lucide-react";
import html2canvas from "html2canvas";
import { Recommendation } from "@/lib/suggestions";

interface SuggestionCardProps {
    data: Recommendation;
    onReset: () => void;
}

export default function SuggestionCard({ data, onReset }: SuggestionCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isSharing, setIsSharing] = useState(false);
    const [showInsights, setShowInsights] = useState(false);

    const handleShare = async () => {
        if (!cardRef.current) return;
        setIsSharing(true);
        try {
            const canvas = await html2canvas(cardRef.current, {
                scale: 2, // Retina quality
                backgroundColor: "#050505",
                useCORS: true,
            });
            const image = canvas.toDataURL("image/png");

            // Web Share API
            if (navigator.share) {
                const blob = await (await fetch(image)).blob();
                const file = new File([blob], "lumina_receipt.png", { type: "image/png" });
                await navigator.share({
                    title: "Lumina Generation",
                    text: `Lumina: ${data.exercise.title} x ${data.fashion.styleName}`,
                    files: [file],
                });
            } else {
                // Fallback Download
                const link = document.createElement("a");
                link.href = image;
                link.download = "lumina_receipt.png";
                link.click();
            }
        } catch (error) {
            console.error("Share failed", error);
        } finally {
            setIsSharing(false);
        }
    };

    const handleCalendar = () => {
        const event = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "BEGIN:VEVENT",
            `SUMMARY:Lumina Workout: ${data.exercise.title}`,
            `DESCRIPTION:${data.exercise.description}\\nIntensity: ${data.exercise.intensity}`,
            `DTSTART:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
            `DURATION:PT${parseInt(data.exercise.duration) || 60}M`,
            "END:VEVENT",
            "END:VCALENDAR"
        ].join("\n");

        const blob = new Blob([event], { type: "text/calendar;charset=utf-8" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "lumina_workout.ics";
        link.click();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-7xl mx-auto p-4 md:p-6 mb-8"
        >
            <div ref={cardRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-px items-stretch bg-white/10 border border-white/10 rounded-3xl overflow-hidden relative group/card">

                {/* Share Button Overlay */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleShare}
                    disabled={isSharing}
                    className="absolute top-4 left-1/2 -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 z-50 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full text-white transition-colors"
                    title="Share Receipt"
                >
                    {isSharing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Share2 size={20} />}
                </motion.button>

                {/* Insights Toggle */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowInsights(!showInsights)}
                    className="absolute top-4 left-4 z-50 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full text-brand-neon transition-colors md:hidden"
                    title="AI Insights"
                >
                    <Info size={20} />
                </motion.button>


                {/* Exercise Column - 'TERMINAL' Style */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-black p-8 md:p-12 relative overflow-hidden group min-h-[600px] flex flex-col justify-between"
                >
                    <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />

                    {/* Header */}
                    <div>
                        <div className="flex justify-between items-start mb-10 border-b border-white/20 pb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-brand-neon animate-pulse rounded-full" />
                                <span className="text-xs font-mono text-brand-neon tracking-[0.2em] uppercase">
                                    Protocol_01
                                </span>
                            </div>
                            <div className="flex items-center gap-4 z-40">
                                <button
                                    onClick={handleCalendar}
                                    className="text-neutral-500 hover:text-brand-neon transition-colors flex items-center gap-2 text-[10px] uppercase font-mono tracking-widest border border-white/10 px-3 py-1 rounded hover:border-brand-neon/50"
                                    title="Add to Calendar"
                                >
                                    <Calendar size={14} />
                                    <span className="hidden sm:inline">Add to Cal</span>
                                </button>
                                <span className="font-mono text-xs text-white/30 tracking-widest">SYS.PHY.44</span>
                            </div>
                        </div>

                        <h2 className="text-5xl md:text-7xl font-heading font-black text-white mb-8 uppercase leading-[0.8] italic tracking-tighter mix-blend-screen">
                            {data.exercise.title}
                        </h2>

                        <p className="text-xl text-neutral-400 font-mono leading-relaxed border-l-2 border-brand-neon pl-6 mb-12 max-w-md">
                            {data.exercise.description}
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                        <div>
                            <span className="block text-[10px] text-neutral-500 uppercase tracking-widest mb-2 font-mono">Duration</span>
                            <span className="text-3xl text-white font-heading font-black italic">{data.exercise.duration}</span>
                        </div>
                        <div>
                            <span className="block text-[10px] text-neutral-500 uppercase tracking-widest mb-2 font-mono">Intensity</span>
                            <span className="text-3xl text-brand-neon font-heading font-black italic">{data.exercise.intensity}</span>
                        </div>
                    </div>

                    {/* AI Insights Overlay (Desktop: Hover / Mobile: Toggle) */}
                    <AnimatePresence>
                        {showInsights && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="absolute inset-x-0 bottom-0 bg-black/95 p-6 border-t border-brand-neon/30 z-30"
                            >
                                <div className="flex items-start gap-3">
                                    <Info className="text-brand-neon shrink-0 mt-1" size={16} />
                                    <div className="space-y-2 font-mono text-xs text-brand-neon/80">
                                        <p>&gt; MATCH_LOGIC: User requested {data.exercise.intensity} intensity.</p>
                                        <p>&gt; AESTHETIC_ALIGN: {data.fashion.styleName} correlates with high-output activity vectors.</p>
                                        <p>&gt; CONFIDENCE: 98.4%</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <button
                        onClick={() => setShowInsights(!showInsights)}
                        className="absolute bottom-4 right-4 text-xs font-mono text-white/20 hover:text-brand-neon transition-colors hidden md:block"
                    >
                        [ VIEW_LOGS ]
                    </button>

                </motion.div>

                {/* Fashion Column - 'RECEIPT' Style */}
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-[#fafafa] text-black p-8 md:p-12 relative overflow-hidden min-h-[600px] flex flex-col justify-between"
                >
                    {/* Barcode Deco */}
                    <div className="absolute top-8 right-8 mix-blend-multiply opacity-40">
                        <div className="flex gap-0.5 h-8 items-end">
                            {[3, 2, 4, 1, 3, 2, 5, 2, 4, 1, 3, 2].map((h, i) => (
                                <div key={i} className="w-1 bg-black" style={{ height: `${h * 20}%` }} />
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-3 mb-10 border-b border-black pb-6">
                            <div className="w-2 h-2 bg-black rounded-full" />
                            <span className="text-xs font-mono text-black tracking-[0.2em] uppercase font-bold">
                                Aesthetic_Loadout
                            </span>
                        </div>

                        <h2 className="text-5xl md:text-7xl font-heading font-black text-black mb-10 uppercase leading-[0.8] italic tracking-tighter">
                            {data.fashion.styleName}
                        </h2>

                        <ul className="grid gap-4 mb-12">
                            {data.fashion.items.map((item, i) => (
                                <li key={i} className="flex justify-between items-baseline border-b border-black/10 pb-3 group hover:pl-2 transition-all">
                                    <a
                                        href={`https://www.google.com/search?q=${encodeURIComponent(item)}&tbm=shop`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-black font-bold uppercase tracking-tight text-lg md:text-xl truncate mr-4 flex items-center gap-2 hover:text-brand-neon hover:bg-black px-2 -ml-2 rounded transition-colors"
                                        title="Search user item"
                                    >
                                        {item}
                                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                    <span className="text-black/40 font-mono text-xs whitespace-nowrap">ITEM_0{i + 1}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex gap-4 items-end">
                        {data.fashion.colorPalette.map((color, i) => (
                            <div key={i} className="group flex flex-col items-center gap-3">
                                <div
                                    className="w-12 h-12 border border-black/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:-translate-y-1 group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                                    style={{ backgroundColor: color }}
                                />
                                <span className="text-[10px] font-mono text-black/50 uppercase tracking-wider">{color}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 text-center"
            >
                <button
                    onClick={onReset}
                    className="group relative inline-flex items-center justify-center px-12 py-5 bg-brand-neon text-black font-heading font-black tracking-widest uppercase text-sm hover:-translate-y-1 hover:shadow-[0_0_40px_-10px_rgba(223,255,0,0.5)] transition-all duration-300 rounded-full"
                >
                    <span className="relative z-10">Initialize New Sequence</span>
                </button>
            </motion.div>
        </motion.div>
    );
}
