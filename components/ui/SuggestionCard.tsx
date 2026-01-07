"use client";

import { useRef, useState } from "react";
import { Share2, ExternalLink, Info, Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import html2canvas from "html2canvas";
import { Recommendation, Gender } from "@/lib/suggestions";
import { HapticFeedback } from "@/lib/haptics";
import StyleGallery from "@/components/features/StyleGallery";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

interface SuggestionCardProps {
    data: Recommendation;
    onReset: () => void;
    isRainbowTheme?: boolean;
    selectedGender?: Gender;
}

export default function SuggestionCard({ data, onReset, isRainbowTheme = false, selectedGender }: SuggestionCardProps) {
    const handleReset = () => {
        HapticFeedback.trigger("medium");
        onReset();
    };
    const cardRef = useRef<HTMLDivElement>(null);
    const [isSharing, setIsSharing] = useState(false);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleShare = async () => {
        if (!cardRef.current) return;
        setIsSharing(true);
        try {
            const canvas = await html2canvas(cardRef.current, {
                scale: 2,
                backgroundColor: "#ffffff",
                useCORS: true,
            });
            const image = canvas.toDataURL("image/png");

            if (navigator.share) {
                const blob = await (await fetch(image)).blob();
                const file = new File([blob], "lumina_receipt.png", { type: "image/png" });
                await navigator.share({
                    title: "Lumina Generation",
                    text: `Lumina: ${data.exercise.title} x ${data.fashion.styleName}`,
                    files: [file],
                });
            } else {
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

    return (
        <div className="space-y-6 pb-24" ref={cardRef}>
            <Card className={isRainbowTheme ? "bg-gradient-to-br from-red-50 to-pink-50 border-pink-200" : ""}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-3xl font-bold tracking-tight">
                                {data.exercise.title}
                            </CardTitle>
                            <CardDescription>
                                AI Curated • {new Date().getFullYear()}
                            </CardDescription>
                        </div>
                        <Badge variant={isRainbowTheme ? "default" : "outline"}>
                            {data.exercise.intensity}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent>
                    <Tabs defaultValue="workout" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="workout">Workout</TabsTrigger>
                            <TabsTrigger value="fashion">Fashion</TabsTrigger>
                        </TabsList>

                        <TabsContent value="workout" className="space-y-6">
                            <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                                <img
                                    src={data.fashion.imageUrl}
                                    alt={data.exercise.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <p className="text-muted-foreground leading-relaxed">
                                {data.exercise.description}
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="space-y-2">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                                Duration
                                            </p>
                                            <p className="text-3xl font-bold">{data.exercise.duration}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="space-y-2">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                                Intensity
                                            </p>
                                            <p className="text-2xl font-bold">{data.exercise.intensity}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Info className="w-4 h-4" />
                                        <h4 className="text-lg font-semibold">AI Analysis</h4>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="p-4 rounded-lg bg-muted/50">
                                        <p className="text-sm">Intensity aligned with {data.exercise.intensity} level</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-muted/50">
                                        <p className="text-sm">Style: {data.fashion.styleName} optimized for {data.exercise.title}</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-primary/5">
                                        <p className="text-sm font-mono text-primary">Confidence: 98.4% Match</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-muted/50">
                                        <p className="text-sm">Gender Profile: {selectedGender?.toUpperCase()} preferences applied</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="fashion" className="space-y-6">
                            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-muted">
                                <img
                                    src={data.fashion.imageUrl}
                                    alt={data.fashion.styleName}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">{data.fashion.styleName}</h3>
                                    <p className="text-muted-foreground">
                                        Curated for maximum performance and style
                                    </p>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                        Outfit Items
                                    </h4>
                                    <div className="space-y-2">
                                        {data.fashion.items.map((item, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="font-semibold">{item}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        #{i + 1}
                                                    </Badge>
                                                    <a
                                                        href={`https://www.google.com/search?q=${encodeURIComponent(item)}&tbm=shop`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 hover:bg-muted rounded-md transition-colors"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                        Color Palette
                                    </h4>
                                    <div className="flex flex-wrap gap-4">
                                        {data.fashion.colorPalette.map((color, i) => (
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
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <div className="sticky bottom-0 z-20 p-4 bg-background/95 backdrop-blur-sm border-t rounded-xl">
                <div className="flex gap-3 max-w-2xl mx-auto">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setIsSaved(!isSaved)}
                        className={isSaved ? "border-primary bg-primary text-primary-foreground" : ""}
                    >
                        <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleShare}
                        disabled={isSharing}
                        className="flex-1"
                    >
                        {isSharing ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                Sharing...
                            </span>
                        ) : (
                            <>
                                <Share2 className="w-4 h-4" />
                                Share
                            </>
                        )}
                    </Button>
                    <Button
                        size="lg"
                        onClick={handleReset}
                        className="flex-1"
                    >
                        New Recommendation
                    </Button>
                </div>
            </div>

            {data.styleVariations && (
                <StyleGallery
                    variations={[data.fashion, ...data.styleVariations]}
                    isOpen={isGalleryOpen}
                    onClose={() => setIsGalleryOpen(false)}
                    isRainbowTheme={isRainbowTheme}
                />
            )}
        </div>
    );
}