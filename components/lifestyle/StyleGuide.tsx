"use client";

import { Shirt, RefreshCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { useHaptics } from "@/hooks/use-haptics";
import Image from "next/image";
import { useIdentity, Identity } from "@/components/providers/IdentityProvider";

type FashionItem = {
    name: string;
    image?: string;
};

type Look = {
    title: string;
    palette: string[];
    items: FashionItem[]; // Changed from string[] to object array
    tags: Identity[];
    image?: string;
};

const LOOKS: Look[] = [
    {
        title: "Monochrome Stealth",
        palette: ["#000000", "#1A1A1A", "#333333"],
        items: [
            { name: "Oversized Tee", image: "/item_oversized_tee.png" },
            { name: "Cargo Tech Pants", image: "/item_tech_pants.png" },
            { name: "Combat Boots", image: "/item_combat_boots.png" }
        ],
        tags: ['Male', 'Non-Binary', 'Queer', 'Trans', 'Pansexual'],
        image: "/fashion_masc_stealth.png"
    },
    {
        title: "Neon Cyber",
        palette: ["#DFFF00", "#050505", "#FFFFFF"],
        items: [
            { name: "Neon Hoodie" },
            { name: "Compression Tights" },
            { name: "Speed Runners" }
        ],
        tags: ['Female', 'Non-Binary', 'Queer', 'Lesbian', 'Trans', 'Pansexual'],
        image: "/fashion_fem_neon.png"
    },
    {
        title: "Earth Core",
        palette: ["#4A4A4A", "#5C5C5C", "#8B4513"],
        items: [
            { name: "Vintage Wash Tee" },
            { name: "Relaxed Chino" },
            { name: "Retro Sneakers" }
        ],
        tags: ['Male', 'Female', 'Gay', 'Lesbian', 'Trans', 'Pansexual']
    },
    {
        title: "Future Minimal",
        palette: ["#FFFFFF", "#E0E0E0", "#000000"],
        items: [
            { name: "Structured Jacket" },
            { name: "Tailored Shorts" },
            { name: "High Tops" }
        ],
        tags: ['Male', 'Female', 'Non-Binary', 'Queer', 'Gay', 'Trans', 'Pansexual']
    },
];

export function StyleGuide() {
    const [currentLook, setCurrentLook] = useState<Look>(LOOKS[0]);
    const { medium } = useHaptics();
    const { identity } = useIdentity();

    const getFilteredLooks = () => {
        return LOOKS.filter(l => l.tags.includes(identity));
    };

    const randomize = () => {
        medium();
        const filtered = getFilteredLooks();
        const pool = filtered.length > 0 ? filtered : LOOKS;
        const random = pool[Math.floor(Math.random() * pool.length)];
        setCurrentLook(random);
    };

    // Re-randomize when identity changes
    useEffect(() => {
        randomize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [identity]);

    return (
        <div className="h-full flex flex-col justify-between relative z-10 transition-all duration-700 ease-in-out">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-oswald text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Shirt className="w-4 h-4" /> Style
                </h2>
                <button onClick={randomize} className="p-2 hover:bg-secondary rounded-full transition-colors hidden group-hover:block z-20">
                    <RefreshCcw className="w-4 h-4 text-muted-foreground" />
                </button>
            </div>

            <div className="flex-1 flex flex-col justify-end relative rounded-xl overflow-hidden group/image">
                {/* Image Background Layer */}
                {currentLook.image && (
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={currentLook.image}
                            alt={currentLook.title}
                            fill
                            className="object-cover opacity-40 mix-blend-overlay group-hover/image:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
                    </div>
                )}

                <div className="z-10 relative p-4 flex flex-col gap-4">
                    <div>
                        <div className="text-3xl font-oswald text-foreground leading-none mb-2 uppercase break-words drop-shadow-xl">
                            {currentLook.title}
                        </div>
                        <div className="flex gap-2">
                            {currentLook.palette.map((c, i) => (
                                <div key={i} className="w-4 h-4 rounded-full border border-border shadow-sm ring-1 ring-white/10" style={{ backgroundColor: c }} />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        {currentLook.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-background/60 backdrop-blur-md p-2 rounded-lg border border-white/5 hover:bg-background/80 transition-colors">
                                {item.image ? (
                                    <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-secondary/50">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded bg-secondary/30 flex items-center justify-center flex-shrink-0">
                                        <Shirt className="w-4 h-4 text-muted/50" />
                                    </div>
                                )}
                                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                    {item.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
