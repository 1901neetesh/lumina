import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
    const body = await request.json();
    const { gender, age, goal, occasion } = body;

    // Simulate AI "Thinking" delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock Database of "AI Decisions"
    const exercises = [
        {
            tags: ["build_muscle", "gym", "male"],
            title: "Hypertrophy 5x5",
            description: "Heavy compound lifts (Squat, Bench, Deadlift) focusing on maximal strength and size accrual.",
            duration: "75 mins",
            intensity: "High"
        },
        {
            tags: ["lose_weight", "outdoor", "female"],
            title: "HIIT Trail Run",
            description: "High-intensity interval sprints on uneven terrain to maximize caloric burn and stability.",
            duration: "45 mins",
            intensity: "High"
        },
        {
            tags: ["tone", "home"],
            title: "Pilates Torch",
            description: "Control-based bodyweight movements focusing on core stability and muscle lengthening.",
            duration: "50 mins",
            intensity: "Medium"
        },
        {
            tags: ["endurance", "gym"],
            title: "Zone 2 Carpentry",
            description: "Steady state cardio on the rower or bike, maintaining 65-75% max heart rate.",
            duration: "90 mins",
            intensity: "Low"
        },
        {
            tags: ["build_muscle", "home"],
            title: "Calisthenics Beast",
            description: "Advanced bodyweight progression: Pistol loops, Planches, and Muscle-ups.",
            duration: "60 mins",
            intensity: "High"
        }
    ];

    const fashions = [
        {
            tags: ["gym", "male", "build_muscle"],
            styleName: "Iron Rebel",
            items: ["Oversized Pump Cover", "5-inch Squat Shorts", "Flat-sole Converse"],
            colorPalette: ["#1C1C1C", "#8B0000", "#FFFFFF"],
            imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=1200&fit=crop&crop=center",
            altText: "Muscular man in black gym wear with red accents lifting weights"
        },
        {
            tags: ["outdoor", "female", "lose_weight"],
            styleName: "Trail Blazer",
            items: ["Wind-resistent Crop", "Compressed Leggings", "Trail Runners"],
            colorPalette: ["#2F4F4F", "#00FF9C", "#1A1A1A"],
            imageUrl: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=1200&fit=crop&crop=center",
            altText: "Athletic woman running on forest trail in sportswear"
        },
        {
            tags: ["home", "tone"],
            styleName: "Zen Tech",
            items: ["Seamless Bodysuit", "Grippy Socks", "Loose Throw-over"],
            colorPalette: ["#B0C4DE", "#FFD700", "#F0F8FF"],
            imageUrl: "https://images.unsplash.com/photo-1506629905607-8b6d34b5db08?w=800&h=1200&fit=crop&crop=center",
            altText: "Woman in comfortable home workout attire doing yoga"
        },
        {
            tags: ["event"],
            styleName: "Athleisure Prime",
            items: ["Dri-fit Polo", "Tapered Chinos", "Minimalist Leather Sneakers"],
            colorPalette: ["#000080", "#C0C0C0", "#FFFFFF"],
            imageUrl: "https://images.unsplash.com/photo-1506629905607-8b6d34b5db08?w=800&h=1200&fit=crop&crop=center",
            altText: "Stylish person in premium athleisure wear for social events"
        }
    ];

    // Simple "AI" matching algorithm
    const exercise = exercises.find(e => e.tags.some(t => t === goal || t === occasion)) || exercises[0];
    const fashion = fashions.find(f => f.tags.some(t => t === occasion || t === gender)) || fashions[0];

    return NextResponse.json({
        exercise: {
            title: exercise.title,
            description: exercise.description,
            duration: exercise.duration,
            intensity: exercise.intensity
        },
        fashion: {
            styleName: fashion.styleName,
            items: fashion.items,
            colorPalette: fashion.colorPalette,
            imageUrl: fashion.imageUrl,
            altText: fashion.altText
        }
    });
}
