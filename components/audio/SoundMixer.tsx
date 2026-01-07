"use client";

import { Sliders } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useAudioEngine } from "@/lib/audio-engine";
import { useHaptics } from "@/hooks/use-haptics";

export function SoundMixer() {
    const { volumes, setVolume } = useAudioEngine();
    const { medium } = useHaptics();

    const handleSlide = (type: 'white' | 'pink' | 'brown', val: number[]) => {
        // medium(); // Haptic on slide might be too much, maybe on end?
        setVolume(type, val[0]);
    };

    return (
        <div className="h-full flex flex-col justify-between">
            <h2 className="text-xl font-oswald text-muted-foreground mb-4 uppercase tracking-widest flex items-center gap-2">
                <Sliders className="w-4 h-4" /> Audio Core
            </h2>

            <div className="flex-1 flex flex-col justify-center space-y-6">
                {/* White Noise */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs uppercase tracking-wider font-medium text-muted-foreground">
                        <span>Focus (White)</span>
                        <span>{Math.round(volumes.white * 100)}%</span>
                    </div>
                    <Slider
                        defaultValue={[0]}
                        max={1}
                        step={0.01}
                        value={[volumes.white]}
                        onValueChange={(val) => handleSlide('white', val)}
                        className="[&_.bg-primary]:bg-primary"
                    />
                </div>

                {/* Pink Noise */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs uppercase tracking-wider font-medium text-muted-foreground">
                        <span>Relax (Pink)</span>
                        <span>{Math.round(volumes.pink * 100)}%</span>
                    </div>
                    <Slider
                        defaultValue={[0]}
                        max={1}
                        step={0.01}
                        value={[volumes.pink]}
                        onValueChange={(val) => handleSlide('pink', val)}
                    />
                </div>

                {/* Brown Noise */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs uppercase tracking-wider font-medium text-muted-foreground">
                        <span>Deep (Brown)</span>
                        <span>{Math.round(volumes.brown * 100)}%</span>
                    </div>
                    <Slider
                        defaultValue={[0]}
                        max={1}
                        step={0.01}
                        value={[volumes.brown]}
                        onValueChange={(val) => handleSlide('brown', val)}
                    />
                </div>
            </div>
        </div>
    );
}
