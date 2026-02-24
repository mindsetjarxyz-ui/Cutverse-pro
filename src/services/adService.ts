// Ad Management Service
// Manages ad display frequency and localStorage counter

const AD_LINK = "https://omg10.com/4/10649293";
const AD_COUNTER_KEY = "ai_tools_ad_counter";

export interface AdCounterState {
  clickCount: number;
  lastReset: number;
}

// Get current counter from localStorage
export function getAdCounter(): AdCounterState {
  try {
    const stored = localStorage.getItem(AD_COUNTER_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading ad counter:", error);
  }
  
  return {
    clickCount: 0,
    lastReset: Date.now(),
  };
}

// Save counter to localStorage
function saveAdCounter(counter: AdCounterState): void {
  try {
    localStorage.setItem(AD_COUNTER_KEY, JSON.stringify(counter));
  } catch (error) {
    console.error("Error saving ad counter:", error);
  }
}

// Check if ad should be shown and return updated counter
export function checkAndUpdateAdCounter(): {
  shouldShowAd: boolean;
  newCount: number;
  adUrl: string;
} {
  const counter = getAdCounter();
  const newCount = counter.clickCount + 1;

  // Show ad on 1st, 4th, 7th, 10th... clicks (1st, then every 3rd after)
  const shouldShowAd = newCount === 1 || (newCount > 1 && (newCount - 1) % 3 === 0);

  // Save updated counter
  const updatedCounter: AdCounterState = {
    clickCount: newCount,
    lastReset: counter.lastReset,
  };
  saveAdCounter(updatedCounter);

  return {
    shouldShowAd,
    newCount,
    adUrl: AD_LINK,
  };
}

// Open ad in new tab
export function openAdInNewTab(): void {
  try {
    window.open(AD_LINK, "_blank", "noopener,noreferrer");
  } catch (error) {
    console.error("Error opening ad:", error);
  }
}

// Get display text for button
export function getGenerateButtonText(): string {
  return "Generate (1 ad for every 3 generations)";
}

// Reset counter (useful for testing)
export function resetAdCounter(): void {
  try {
    localStorage.removeItem(AD_COUNTER_KEY);
  } catch (error) {
    console.error("Error resetting ad counter:", error);
  }
}
