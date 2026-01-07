"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, ExternalLink, Calendar, Info, Palette } from "lucide-react";
import html2canvas from "html2canvas";
import { Recommendation } from "@/lib/suggestions";
import { HapticFeedback } from "@/lib/haptics";
import StyleGallery from "@/components/features/StyleGallery";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SuggestionCardProps {
    data: Recommendation;
    onReset: () => void;
}

export default function SuggestionCard({ data, onReset }: SuggestionCardProps) {
    const handleReset = () => {
        HapticFeedback.trigger("medium");
        onReset();
    };
    const cardRef = useRef<HTMLDivElement>(null);
    const [isSharing, setIsSharing] = useState(false);
    const [showInsights, setShowInsights] = useState(false);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

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
            className="w-full max-w-7xl mx-auto p-3 sm:p-4 md:p-6 mb-6 sm:mb-8"
        >
            <Card ref={cardRef} className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-px items-stretch bg-white/10 border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden relative group/card p-0">
                <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-px items-stretch">

                {/* Share Button Overlay */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleShare}
                    disabled={isSharing}
                    className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 md:left-auto md:right-16 md:translate-x-0 z-50 p-2 sm:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full text-white transition-colors"
                    title="Share Receipt"
                >
                    {isSharing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Share2 size={20} />}
                </motion.button>

                {/* Style Gallery Button */}
                {data.styleVariations && data.styleVariations.length > 0 && (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsGalleryOpen(true)}
                        className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 z-50 p-2 sm:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full text-white transition-colors"
                        title="View Style Variations"
                    >
                        <Palette size={20} />
                    </motion.button>
                )}

                {/* Insights Toggle */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowInsights(!showInsights)}
                    className="absolute top-3 sm:top-4 left-3 sm:left-4 z-50 p-2 sm:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full text-brand-neon transition-colors md:hidden"
                    title="AI Insights"
                >
                    <Info size={20} />
                </motion.button>


                {/* Exercise Column - 'TERMINAL' Style */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                     className="bg-black p-4 sm:p-6 md:p-8 lg:p-12 relative overflow-hidden group min-h-[400px] sm:min-h-[500px] md:min-h-[600px] flex flex-col justify-between"
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

                         <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-heading font-black text-white mb-4 sm:mb-6 md:mb-8 uppercase leading-[0.8] italic tracking-tighter mix-blend-screen">
                            {data.exercise.title}
                        </h2>

                         <p className="text-sm sm:text-base md:text-lg lg:text-xl text-neutral-400 font-mono leading-relaxed border-l-2 border-brand-neon pl-3 sm:pl-4 md:pl-6 mb-6 sm:mb-8 md:mb-12 max-w-sm md:max-w-md">
                            {data.exercise.description}
                        </p>
                    </div>

                    {/* Stats Grid */}
                     <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 border-t border-white/10 pt-4 sm:pt-6 md:pt-8">
                         <div>
                             <span className="block text-[9px] sm:text-[10px] text-neutral-500 uppercase tracking-widest mb-1 sm:mb-2 font-mono">Duration</span>
                             <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white font-heading font-black italic">{data.exercise.duration}</span>
                         </div>
                         <div>
                             <span className="block text-[9px] sm:text-[10px] text-neutral-500 uppercase tracking-widest mb-1 sm:mb-2 font-mono">Intensity</span>
                             <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-brand-neon font-heading font-black italic">{data.exercise.intensity}</span>
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
                     className="bg-[#fafafa] text-black relative overflow-hidden min-h-[400px] sm:min-h-[500px] md:min-h-[600px] flex flex-col"
                    style={{
                        background: `linear-gradient(135deg, ${data.fashion.colorPalette[0] || '#fafafa'}05 0%, #fafafa 100%)`
                    }}
                >
                    {/* Barcode Deco */}
                    <div className="absolute top-8 right-8 mix-blend-multiply opacity-40">
                        <div className="flex gap-0.5 h-8 items-end">
                            {[3, 2, 4, 1, 3, 2, 5, 2, 4, 1, 3, 2].map((h, i) => (
                                <div key={i} className="w-1 bg-black" style={{ height: `${h * 20}%` }} />
                            ))}
                        </div>
                    </div>

                     {/* Fashion Hero Image */}
                     <div className="relative mb-4 sm:mb-6 md:mb-8 px-4 sm:px-6 md:px-8 lg:px-12">
                         <div className="relative group">
                             <div className="aspect-[4/5] w-full max-w-xs sm:max-w-sm mx-auto overflow-hidden rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl border-2 sm:border-4 border-white/20 bg-gradient-to-br from-gray-100 to-gray-200">
                                <img
                                    src={data.fashion.imageUrl}
                                    alt={data.fashion.altText}
                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110 opacity-0 group-hover:opacity-100"
                                    loading="lazy"
                                    onLoad={(e) => {
                                        e.currentTarget.style.opacity = '1';
                                        e.currentTarget.previousElementSibling?.classList.add('opacity-0');
                                    }}
                                />

                                {/* Loading shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]" />
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                {/* Premium overlay effects */}
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-brand-neon/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                                    <span className="text-black text-xs font-bold animate-pulse">✨</span>
                                </div>
                            </div>

                            {/* Floating style badge */}
                            <div className="absolute -top-3 -right-3 bg-brand-neon text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg transform scale-95 group-hover:scale-100 transition-transform duration-300">
                                {data.fashion.styleName}
                            </div>
                        </div>
                    </div>

                     <div className="px-4 sm:px-6 md:px-8 lg:px-12 animate-in slide-in-from-bottom-4 duration-700 delay-300">
                          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8 border-b border-black/20 pb-3 sm:pb-4">
                             <div className="w-2 h-2 bg-black rounded-full" />
                             <span className="text-[10px] sm:text-xs font-mono text-black tracking-[0.15em] sm:tracking-[0.2em] uppercase font-bold">
                                 Aesthetic_Loadout
                             </span>
                         </div>

                         <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-heading font-black text-black mb-6 sm:mb-8 md:mb-10 uppercase leading-[0.8] italic tracking-tighter animate-in slide-in-from-bottom-4 duration-500 delay-500">
                              {data.fashion.styleName}
                          </h2>

                         <ul className="grid gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-12 animate-in slide-in-from-bottom-4 duration-500 delay-700">
                              {data.fashion.items.map((item, i) => (
                                  <li key={i} className="flex justify-between items-baseline border-b border-black/10 pb-2 sm:pb-3 group hover:pl-2 hover:bg-black/5 rounded-lg px-2 -mx-2 transition-all duration-300">
                                     <a
                                         href={`https://www.google.com/search?q=${encodeURIComponent(item)}&tbm=shop`}
                                         target="_blank"
                                         rel="noopener noreferrer"
                                         className="text-black font-bold uppercase tracking-tight text-sm sm:text-base md:text-lg lg:text-xl truncate mr-2 sm:mr-4 flex items-center gap-2 hover:text-brand-neon hover:bg-black px-2 -ml-2 rounded transition-colors"
                                         title="Search user item"
                                     >
                                         {item}
                                         <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                     </a>
                                     <span className="text-black/40 font-mono text-[10px] sm:text-xs whitespace-nowrap">ITEM_0{i + 1}</span>
                                 </li>
                             ))}
                         </ul>
                     </div>

                     <div className="flex gap-2 sm:gap-3 md:gap-4 items-end justify-center animate-in slide-in-from-bottom-4 duration-500 delay-900">
                          {data.fashion.colorPalette.map((color, i) => (
                              <div key={i} className="group flex flex-col items-center gap-1 sm:gap-2 md:gap-3">
                                  <div
                                      className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 border-2 border-black/30 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:scale-105 sm:group-hover:scale-110 rounded-lg overflow-hidden"
                                      style={{ backgroundColor: color }}
                                  >
                                      <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  </div>
                                  <span className="text-[7px] sm:text-[8px] md:text-[10px] font-mono text-black/60 uppercase tracking-wider group-hover:text-black transition-colors">{color}</span>
                              </div>
                          ))}
                       </div>
                 </motion.div>
            </CardContent>
            </Card>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 text-center"
            >
                 <Button
                     onClick={handleReset}
                     className="group relative inline-flex items-center justify-center px-8 py-3 sm:px-10 sm:py-4 md:px-12 md:py-5 bg-primary text-primary-foreground font-heading font-black tracking-widest uppercase text-sm sm:text-base hover:-translate-y-1 hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.5)] transition-all duration-300 rounded-full"
                     size="lg"
                 >
                     <span className="relative z-10">Initialize New Sequence</span>
                 </Button>
            </motion.div>

            {/* Style Gallery */}
            {data.styleVariations && (
                <StyleGallery
                    variations={[data.fashion, ...data.styleVariations]}
                    isOpen={isGalleryOpen}
                    onClose={() => setIsGalleryOpen(false)}
                />
            )}
        </motion.div>
    );
}
