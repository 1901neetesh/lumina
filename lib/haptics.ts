// Haptic feedback utility for mobile devices
export class HapticFeedback {
  private static isSupported(): boolean {
    return typeof navigator !== "undefined" && "vibrate" in navigator;
  }

  private static getPattern(type: "light" | "medium" | "heavy" | "success" | "error"): number | number[] {
    switch (type) {
      case "light":
        return 10; // Single light tap
      case "medium":
        return 15; // Medium tap
      case "heavy":
        return [20, 10, 20]; // Double heavy tap
      case "success":
        return [10, 50, 10, 50, 10]; // Success pattern
      case "error":
        return [50, 20, 50, 20, 50]; // Error pattern
      default:
        return 15;
    }
  }

  static trigger(type: "light" | "medium" | "heavy" | "success" | "error" = "medium"): void {
    if (!this.isSupported()) return;

    try {
      const pattern = this.getPattern(type);
      navigator.vibrate(pattern);
    } catch (error) {
      console.warn("Haptic feedback failed:", error);
    }
  }

  static stop(): void {
    if (!this.isSupported()) return;

    try {
      navigator.vibrate(0);
    } catch (error) {
      console.warn("Failed to stop haptic feedback:", error);
    }
  }

  // Advanced haptics for modern devices (experimental)
  static async triggerAdvanced(pattern: number[]): Promise<void> {
    if (!this.isSupported()) return;

    try {
      // Check if device supports advanced vibration patterns
      if ("vibrate" in navigator) {
        navigator.vibrate(pattern);
      }
    } catch (error) {
      console.warn("Advanced haptic feedback failed:", error);
    }
  }
}