"use client";

import { HapticFeedback } from "@/lib/haptics";
import { useTheme, Theme } from "@/lib/theme";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

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
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Settings</DialogTitle>
                    <DialogDescription>
                        Customize your experience
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="preferences" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="preferences">Preferences</TabsTrigger>
                        <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    </TabsList>

                    <TabsContent value="preferences" className="space-y-4">
                        <Card>
                            <CardContent className="flex items-center justify-between py-6">
                                <div className="space-y-1">
                                    <p className="font-semibold">Haptic Feedback</p>
                                    <p className="text-sm text-muted-foreground">
                                        Vibration response
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.haptics}
                                    onCheckedChange={() => handleToggle("haptics")}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="flex items-center justify-between py-6">
                                <div className="space-y-1">
                                    <p className="font-semibold">Sound Effects</p>
                                    <p className="text-sm text-muted-foreground">
                                        UI interactions
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.audio}
                                    onCheckedChange={() => handleToggle("audio")}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="appearance" className="space-y-4">
                        <Card>
                            <CardContent className="space-y-4 py-6">
                                <div className="space-y-3">
                                    <p className="font-semibold">Theme</p>
                                    <p className="text-sm text-muted-foreground">
                                        Color scheme
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {themes.map((t) => (
                                        <Button
                                            key={t.value}
                                            variant={theme === t.value ? "default" : "outline"}
                                            onClick={() => handleThemeChange(t.value)}
                                            className="justify-start"
                                        >
                                            <div
                                                className="w-4 h-4 rounded-full mr-3"
                                                style={{ backgroundColor: t.color }}
                                            />
                                            {t.label}
                                            {theme === t.value && (
                                                <Badge variant="secondary" className="ml-auto">
                                                    Active
                                                </Badge>
                                            )}
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <div className="pt-4 border-t">
                    <p className="text-xs text-center text-muted-foreground">
                        Lumina v2.0.4 • Build 2024
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}