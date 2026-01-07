"use client";

import { useEffect, useState } from "react";
import { HistoryItem, getHistory } from "@/lib/history";
import { Clock, X } from "lucide-react";
import { HapticFeedback } from "@/lib/haptics";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HistoryDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HistoryDrawer({ isOpen, onClose }: HistoryDrawerProps) {
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        if (isOpen) {
            const historyData = getHistory();
            setHistory(historyData);
        }
    }, [isOpen]);

    const handleClose = () => {
        HapticFeedback.trigger("light");
        onClose();
    };

    return (
        <Sheet open={isOpen} onOpenChange={handleClose}>
            <SheetContent>
                <SheetHeader className="border-b pb-4">
                    <div className="flex justify-between items-center">
                        <div className="space-y-1">
                            <SheetTitle>Archives</SheetTitle>
                            <SheetDescription>
                                Your saved recommendations
                            </SheetDescription>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </SheetHeader>

                <ScrollArea className="flex-1">
                    <div className="space-y-3 py-4">
                        {history.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                        <Clock className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <p className="font-semibold">No archives yet</p>
                                    <p className="text-sm text-muted-foreground">
                                        Your recommendations will appear here
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            history.map((item) => (
                                <Card key={item.id}>
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1 space-y-2">
                                                <p className="font-semibold">
                                                    {item.recommendation.exercise.title}
                                                </p>
                                                <Badge>
                                                    {item.recommendation.fashion.styleName}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                                <Clock className="w-3 h-3" />
                                                {new Date(item.timestamp).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </ScrollArea>

                <div className="border-t pt-4">
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-xs text-center text-muted-foreground">
                                {history.length} {history.length === 1 ? 'entry' : 'entries'} saved
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </SheetContent>
        </Sheet>
    );
}