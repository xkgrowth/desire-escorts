"use client";

import { useEffect } from "react";
import Gleap from "gleap";

declare global {
  interface Window {
    __gleapInitialized?: boolean;
  }
}

const gleapApiKey = process.env.NEXT_PUBLIC_GLEAP_API_KEY;

export function GleapWidget() {
  useEffect(() => {
    if (!gleapApiKey || typeof window === "undefined" || window.__gleapInitialized) {
      return;
    }

    try {
      Gleap.initialize(gleapApiKey);
      Gleap.setStyles({
        buttonColor: "#FFFFFF",
        primaryColor: "#000000",
        headerColor: "#000000",
        backgroundColor: "#FFFFFF",
      });
      Gleap.showFeedbackButton(true);
      window.__gleapInitialized = true;
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to initialize Gleap widget", error);
      }
    }
  }, []);

  return null;
}
