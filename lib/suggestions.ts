export type Gender = "male" | "female" | "non-binary" | "gay" | "lesbian" | "bisexual" | "pansexual" | "transgender" | "queer" | "other";

export type UserInput = {
    gender: Gender;
    age: string;
    goal: "build_muscle" | "lose_weight" | "tone" | "endurance";
    occasion: "gym" | "outdoor" | "home" | "event";
};

export type FashionStyle = {
    styleName: string;
    items: string[];
    colorPalette: string[];
    imageUrl: string;
    altText: string;
};

export type Recommendation = {
    exercise: {
        title: string;
        description: string;
        duration: string;
        intensity: "High" | "Medium" | "Low";
    };
    fashion: FashionStyle;
    styleVariations?: FashionStyle[];
};

export async function getRecommendation(input: UserInput): Promise<Recommendation> {
    try {
        const response = await fetch("/api/suggestions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
        });

        if (!response.ok) {
            throw new Error("AI core offline");
        }

        return await response.json();
    } catch (error) {
        console.error("AI Generation failed:", error);
        // Fallback if API fails
        return {
            exercise: {
                title: "System Offline",
                description: "Neural link severed. Please retry or engage manual protocol.",
                duration: "N/A",
                intensity: "Low" as const,
            },
            fashion: {
                styleName: "Default Protocol",
                items: ["Standard Issue Tee", "Grey Sweatpants", "Running Shoes"],
                colorPalette: ["#333", "#666", "#999"],
                imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=1200&fit=crop&crop=center",
                altText: "Default athletic wear style"
            }
        };
    }
}
