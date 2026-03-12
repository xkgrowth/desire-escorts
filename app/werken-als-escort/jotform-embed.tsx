"use client";

import { useEffect, useRef } from "react";

export function JotformEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const existingScript = containerRef.current.querySelector("script");
    if (existingScript) return;

    const script = document.createElement("script");
    script.src = "https://form.jotform.com/jsform/243517738674367";
    script.type = "text/javascript";
    script.async = true;

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        const scriptToRemove = containerRef.current.querySelector("script");
        if (scriptToRemove) {
          containerRef.current.removeChild(scriptToRemove);
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="jotform-container min-h-[600px] w-full"
      style={{
        colorScheme: "dark",
      }}
    />
  );
}
