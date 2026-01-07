"use client";

import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { FashionStyle } from "@/lib/suggestions";
import { useState } from "react";
import { saveToFavorites } from "@/lib/history";
import { HapticFeedback } from "@/lib/haptics";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StyleGalleryProps {
    variations: FashionStyle[];
    isOpen: boolean;
    onClose: () => void;
    onSelectStyle?: (style: FashionStyle) => void;
    isRainbowTheme?: boolean;
}

export default function StyleGallery({ variations, isOpen, onClose, onSelectStyle, isRainbowTheme = false }: StyleGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

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

    const next = () => setCurrentIndex((prev) => (prev + 1) % variations.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + variations.length) % variations.length);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader className="border-b pb-4">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <DialogTitle>Style Gallery</DialogTitle>
                            <DialogDescription>
                                {currentIndex + 1} of {variations.length}
                            </DialogDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleSaveFavorite}
                            className={isRainbowTheme ? "border-pink-200 text-pink-500" : ""}
                        >
                            <Heart className="w-4 h-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                        <div className="p-6 space-y-6">
                            <Tabs defaultValue="preview">
                                <TabsList>
                                    <TabsTrigger value="preview">Preview</TabsTrigger>
                                    <TabsTrigger value="details">Details</TabsTrigger>
                                </TabsList>

                                <TabsContent value="preview" className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="aspect-[3/4] rounded-xl overflow-hidden bg-muted">
                                            <img
                                                src={currentStyle.imageUrl}
                                                alt={currentStyle.altText}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <Card>
                                                <CardContent className="p-6">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                                                                Style Name
                                                            </p>
                                                            <p className="text-2xl font-bold">
                                                                {currentStyle.styleName}
                                                            </p>
                                                        </div>

                                                        <Separator />

                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm text-muted-foreground">
                                                                Navigate variations
                                                            </span>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    onClick={prev}
                                                                    disabled={currentIndex === 0}
                                                                >
                                                                    <ChevronLeft className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    onClick={next}
                                                                    disabled={currentIndex === variations.length - 1}
                                                                >
                                                                    <ChevronRight className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <div className="flex justify-center gap-2">
                                                {variations.map((_, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setCurrentIndex(i)}
                                                        className={`
                                                            w-2 h-2 rounded-full transition-colors
                                                            ${i === currentIndex 
                                                                ? isRainbowTheme 
                                                                    ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                                                                    : 'bg-primary' 
                                                                : 'bg-muted-foreground/20 hover:bg-muted-foreground/40'
                                                            }
                                                        `}
                                                        aria-label={`Style variation ${i + 1}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="details" className="space-y-6">
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="space-y-6">
                                                <div>
                                                    <h4 className="text-lg font-semibold mb-4">Outfit Items</h4>
                                                    <div className="space-y-2">
                                                        {currentStyle.items.map((item, i) => (
                                                            <div
                                                                key={i}
                                                                className="flex justify-between items-center p-4 rounded-lg border"
                                                            >
                                                                <span className="font-medium">{item}</span>
                                                                <Badge variant="outline">
                                                                    #{i + 1}
                                                                </Badge>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <Separator />

                                                <div>
                                                    <h4 className="text-lg font-semibold mb-4">Color Palette</h4>
                                                    <div className="flex flex-wrap gap-4">
                                                        {currentStyle.colorPalette.map((color, i) => (
                                                            <div
                                                                key={i}
                                                                className="space-y-2"
                                                            >
                                                                <div
                                                                    className="w-16 h-16 rounded-lg border-2"
                                                                    style={{ backgroundColor: color }}
                                                                />
                                                                <p className="text-xs font-mono text-center text-muted-foreground">
                                                                    {color}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </ScrollArea>
                </div>

                {onSelectStyle && (
                    <div className="border-t p-4">
                        <Button
                            onClick={() => onSelectStyle(currentStyle)}
                            className="w-full"
                            size="lg"
                        >
                            Select This Style
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}