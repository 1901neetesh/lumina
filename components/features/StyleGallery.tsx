"use client";

import { X, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { FashionStyle } from "@/lib/suggestions";
import { useState } from "react";
import { saveToFavorites } from "@/lib/history";
import { HapticFeedback } from "@/lib/haptics";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface StyleGalleryProps {
    variations: FashionStyle[];
    isOpen: boolean;
    onClose: () => void;
    onSelectStyle?: (style: FashionStyle) => void;
}

export default function StyleGallery({ variations, isOpen, onClose, onSelectStyle }: StyleGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => setCurrentIndex((prev) => (prev + 1) % variations.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + variations.length) % variations.length);

    const currentStyle = variations[currentIndex];

    const handleSaveFavorite = () => {
        const mockRecommendation = {
            exercise: {
                title: "Favorite Style",
                description: "Saved favorite style variation",
                duration: "N/A",
                intensity: "Low" as const,
            },
            fashion: currentStyle,
        };
        saveToFavorites(mockRecommendation);
        HapticFeedback.trigger("success");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black max-w-2xl">
                <DialogHeader>
                    <div className="flex justify-between items-center">
                        <DialogTitle className="text-2xl font-heading font-black uppercase tracking-tight">
                            Style Variations
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleSaveFavorite}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            title="Save to Favorites"
                        >
                            <Heart size={20} />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Image */}
                        <div className="relative">
                            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                                <img
                                    src={currentStyle.imageUrl}
                                    alt={currentStyle.altText}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-sm font-bold">
                                {currentStyle.styleName}
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-heading font-black text-xl mb-3 uppercase tracking-tight">
                                    Outfit Items
                                </h4>
                                <ul className="space-y-2">
                                    {currentStyle.items.map((item, i) => (
                                        <li key={i} className="flex justify-between items-center py-2 border-b border-black/10">
                                            <span className="font-medium">{item}</span>
                                            <span className="text-sm text-black/60">#{i + 1}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-heading font-black text-lg mb-3 uppercase tracking-tight">
                                    Color Palette
                                </h4>
                                <div className="flex gap-3">
                                    {currentStyle.colorPalette.map((color, i) => (
                                        <div key={i} className="flex flex-col items-center gap-2">
                                            <div
                                                className="w-12 h-12 rounded-lg border-2 border-black/20"
                                                style={{ backgroundColor: color }}
                                            />
                                            <span className="text-xs font-mono text-black/60">{color}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center mt-6 pt-6 border-t border-black/10">
                        <Button variant="outline" onClick={prev}>
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Previous
                        </Button>

                        <div className="flex gap-2">
                            {variations.map((_, i) => (
                                <Button
                                    key={i}
                                    variant={i === currentIndex ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentIndex(i)}
                                    className="w-8 h-8 p-0"
                                >
                                    {i + 1}
                                </Button>
                            ))}
                        </div>

                        <Button variant="outline" onClick={next}>
                            Next
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>

                    {/* Select Button */}
                    {onSelectStyle && (
                        <div className="mt-6 text-center">
                            <Button onClick={() => onSelectStyle(currentStyle)}>
                                Select This Style
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}