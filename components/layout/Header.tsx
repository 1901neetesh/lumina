"use client";

import { Bell, Settings, User } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";
import { useIdentity, Identity } from "@/components/providers/IdentityProvider";

export function Header() {
    const { medium, success } = useHaptics();
    const { identity, setIdentity } = useIdentity();

    const handleIdentityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value as Identity;
        setIdentity(val);
        success();
    };

    return (
        <header className="flex w-full items-center justify-between px-6 py-6 fade-in h-[10vh]">
            <div className="flex flex-col">
                <h1 className="text-3xl font-oswald font-bold tracking-tight text-primary">
                    LUMINA
                </h1>
                <span className="text-xs font-medium tracking-widest text-muted-foreground">
                    EST. 2026
                </span>
            </div>

            <div className="flex items-center gap-4">
                {/* Identity Selector */}
                <div className="relative group">
                    <User className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <select
                        value={identity}
                        onChange={handleIdentityChange}
                        className="pl-8 pr-4 py-1.5 rounded-full bg-secondary/50 border border-transparent hover:border-border text-xs uppercase font-bold tracking-wider focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-Binary">Non-Binary</option>
                        <option value="Gay">Gay</option>
                        <option value="Lesbian">Lesbian</option>
                        <option value="Queer">Queer</option>
                        <option value="Trans">Trans</option>
                        <option value="Pansexual">Pansexual</option>
                    </select>
                </div>

                <button
                    onClick={medium}
                    className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                    <Bell className="h-5 w-5" />
                </button>
                <button
                    onClick={medium}
                    className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                    <Settings className="h-5 w-5" />
                </button>
            </div>
        </header>
    );
}
