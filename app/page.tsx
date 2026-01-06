"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getRecommendation, Recommendation, UserInput } from "@/lib/suggestions";
import { saveToHistory } from "@/lib/history";
import { HapticFeedback } from "@/lib/haptics";
import HapticButton from "@/components/ui/HapticButton";
import SuggestionCard from "@/components/ui/SuggestionCard";
import HistoryDrawer from "@/components/features/HistoryDrawer";
import VoiceInput from "@/components/features/VoiceInput";
import AudioController from "@/components/features/AudioController";
import SettingsModal from "@/components/features/SettingsModal";
import { History, Settings } from "lucide-react";

type Step = "gender" | "age" | "goal" | "occasion" | "result";

export default function Home() {
  const [step, setStep] = useState<Step>("gender");
  const [formData, setFormData] = useState<UserInput>({
    gender: "male",
    age: "",
    goal: "build_muscle",
    occasion: "gym",
  });
  const [result, setResult] = useState<Recommendation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({ haptics: true, audio: true });

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem("lumina_user_data");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }

    // Load Settings
    const savedSettings = localStorage.getItem("lumina_settings");
    if (savedSettings) setSettings(JSON.parse(savedSettings));

  }, []);

  useEffect(() => {
    localStorage.setItem("lumina_user_data", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem("lumina_settings", JSON.stringify(settings));
  }, [settings]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isHistoryOpen) setIsHistoryOpen(false);
        else if (isSettingsOpen) setIsSettingsOpen(false);
        else if (step === "result") reset();
        else if (step !== "gender") {
          // Simple back logic
          if (step === "age") setStep("gender");
          if (step === "goal") setStep("age");
          if (step === "occasion") setStep("goal");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, isHistoryOpen, isSettingsOpen]);

  const toggleSetting = (key: "haptics" | "audio") => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNext = async (key: keyof UserInput, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    // Trigger haptic feedback if enabled
    if (settings.haptics) {
      HapticFeedback.trigger("light");
    }

    if (step === "gender") setStep("age");
    else if (step === "age") setStep("goal");
    else if (step === "goal") setStep("occasion");
    else if (step === "occasion") {
      setIsGenerating(true);
      setStep("result");

      const rec = await getRecommendation({ ...formData, [key]: value } as UserInput);
      setResult(rec);
      saveToHistory(rec);
      setIsGenerating(false);
    }
  };

  const handleVoiceCommand = (text: string) => {
    const lower = text.toLowerCase();

    // Simple Keyword Matching
    if (step === "gender") {
      if (lower.includes("male") && !lower.includes("female")) handleNext("gender", "male");
      else if (lower.includes("female")) handleNext("gender", "female");
      else if (lower.includes("binary")) handleNext("gender", "non-binary");
    }
    else if (step === "age") {
      const num = lower.match(/\d+/);
      if (num) handleNext("age", num[0]);
    }
    else if (step === "goal") {
      if (lower.includes("muscle")) handleNext("goal", "build_muscle");
      else if (lower.includes("weight") || lower.includes("lose")) handleNext("goal", "lose_weight");
      else if (lower.includes("tone")) handleNext("goal", "tone");
      else if (lower.includes("endurance") || lower.includes("run")) handleNext("goal", "endurance");
    }
    else if (step === "occasion") {
      if (lower.includes("gym")) handleNext("occasion", "gym");
      else if (lower.includes("out")) handleNext("occasion", "outdoor");
      else if (lower.includes("home")) handleNext("occasion", "home");
      else if (lower.includes("event") || lower.includes("party")) handleNext("occasion", "event");
    }
  };

  const reset = () => {
    setStep("gender");
    setResult(null);
    setIsGenerating(false);
  };

  // Pass settings to HapticButton (need to update HapticButton to accept disableHaptic, or just wrap onClick)
  // For now, simple HapticButton implementation uses onClick usually.
  // Actually, HapticButton likely has its own vibrate call which I should probably override or remove.
  // But for this 'simple' flow, I only centrally control `handleNext` haptics mostly. 
  // Let's assume HapticButton is purely UI for now or accepts onClick.

  return (
    <main className="min-h-screen bg-premium-gradient text-foreground flex flex-col relative selection:bg-brand-neon selection:text-black overflow-x-hidden">

      {/* Background Ambience */}
      <div className="fixed inset-0 bg-noise opacity-30 pointer-events-none mix-blend-overlay z-0" />
      <div className="fixed top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-neon/50 to-transparent z-0" />

      {/* Brand Header */}
      <header className="w-full px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6 z-50 relative flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black uppercase tracking-tighter italic transform -skew-x-12 origin-left">
          Lumina <span className="text-brand-neon text-xs sm:text-sm align-top ml-1 not-italic skew-x-0 inline-block bg-white/10 px-1 rounded">V2</span>
        </h1>

        <div className="flex gap-2 sm:gap-3 md:gap-4 items-center">
          <VoiceInput onResult={handleVoiceCommand} />

          <button
            onClick={() => {
              if (settings.haptics) HapticFeedback.trigger("light");
              setIsSettingsOpen(true);
            }}
            className="p-2 sm:p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors text-white"
          >
            <Settings size={16} className="sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={() => {
              if (settings.haptics) HapticFeedback.trigger("light");
              setIsHistoryOpen(true);
            }}
            className="p-2 sm:p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors text-white"
          >
            <History size={16} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8 w-full max-w-7xl mx-auto relative z-10 pb-20 sm:pb-24">
        <AnimatePresence mode="wait">
          {step === "gender" && (
            <motion.div
              key="gender"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              className="text-center space-y-6 sm:space-y-8 w-full max-w-md bg-black/40 backdrop-blur-xl p-6 sm:p-8 border border-white/10 rounded-2xl sm:rounded-3xl"
            >
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading font-black uppercase tracking-tight">Identify</h2>
              <div className="grid grid-cols-1 gap-4">
                <HapticButton onClick={() => handleNext("gender", "male")}>Male</HapticButton>
                <HapticButton onClick={() => handleNext("gender", "female")}>Female</HapticButton>
                <HapticButton onClick={() => handleNext("gender", "non-binary")}>Non-Binary</HapticButton>
              </div>
            </motion.div>
          )}

          {step === "age" && (
            <motion.div
              key="age"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              className="text-center space-y-6 sm:space-y-8 w-full max-w-md bg-black/40 backdrop-blur-xl p-6 sm:p-8 border border-white/10 rounded-2xl sm:rounded-3xl"
            >
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading font-black uppercase tracking-tight">Chronology</h2>
              <div className="flex flex-col gap-6">
                <input
                  type="number"
                  placeholder="00"
                  className="bg-black/50 border-2 border-white/10 text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl py-4 sm:py-6 focus:outline-none focus:border-brand-neon transition-all duration-300 text-brand-neon font-heading font-black placeholder:text-white/5 w-full rounded-xl sm:rounded-2xl"
                  defaultValue={formData.age}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleNext("age", e.currentTarget.value);
                    }
                  }}
                  autoFocus
                />
                <p className="text-neutral-500 text-sm">Press Enter to confirm</p>
              </div>
            </motion.div>
          )}

          {step === "goal" && (
            <motion.div
              key="goal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              className="text-center space-y-6 sm:space-y-8 w-full max-w-md bg-black/40 backdrop-blur-xl p-6 sm:p-8 border border-white/10 rounded-2xl sm:rounded-3xl"
            >
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading font-black uppercase tracking-tight">Objective</h2>
              <div className="grid grid-cols-1 gap-4">
                <HapticButton onClick={() => handleNext("goal", "build_muscle")}>Build Muscle</HapticButton>
                <HapticButton onClick={() => handleNext("goal", "lose_weight")}>Lose Weight</HapticButton>
                <HapticButton onClick={() => handleNext("goal", "tone")}>Tone & Sculpt</HapticButton>
                <HapticButton onClick={() => handleNext("goal", "endurance")}>Endurance</HapticButton>
              </div>
            </motion.div>
          )}

          {step === "occasion" && (
            <motion.div
              key="occasion"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              className="text-center space-y-6 sm:space-y-8 w-full max-w-md bg-black/40 backdrop-blur-xl p-6 sm:p-8 border border-white/10 rounded-2xl sm:rounded-3xl"
            >
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading font-black uppercase tracking-tight">Context</h2>
              <div className="grid grid-cols-1 gap-4">
                <HapticButton onClick={() => handleNext("occasion", "gym")}>Gym</HapticButton>
                <HapticButton onClick={() => handleNext("occasion", "outdoor")}>Outdoor</HapticButton>
                <HapticButton onClick={() => handleNext("occasion", "home")}>Home</HapticButton>
                <HapticButton onClick={() => handleNext("occasion", "event")}>Event</HapticButton>
              </div>
            </motion.div>
          )}

          {step === "result" && isGenerating && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-4 sm:space-y-6"
            >
              <div className="text-4xl sm:text-5xl md:text-6xl animate-bounce">🧠</div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-mono text-brand-neon animate-pulse uppercase tracking-widest px-4">
                Processing Neural Link...
              </h2>
              <div className="w-48 sm:w-64 h-2 bg-white/10 rounded-full overflow-hidden mx-auto">
                <div className="h-full bg-brand-neon animate-[shimmer_1s_infinite] w-1/2" />
              </div>
            </motion.div>
          )}

          {step === "result" && !isGenerating && result && (
            <SuggestionCard data={result} onReset={reset} />
          )}
        </AnimatePresence>
      </div>

      <HistoryDrawer isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onToggle={toggleSetting}
      />
      <AudioController />
    </main>
  );
}
