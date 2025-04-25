"use client";

import { useState, useEffect } from "react";

/**
 * useKeyboardHeight
 *
 * Tracks the height of the on-screen keyboard by comparing
 * the layout viewport (window.innerHeight) to the visual viewport
 * (window.visualViewport.height). Falls back to window.resize
 * if visualViewport is unavailable.
 *
 * @returns keyboardHeight in pixels (0 if the keyboard is closed)
 */
export function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    // Store the initial layout viewport height for fallback
    const initialHeight = window.innerHeight;

    // Handler for Visual Viewport API
    function onVisualResize() {
      const vh = window.visualViewport!.height;
      const ih = window.innerHeight;
      // Only positive differences matter
      setKeyboardHeight(Math.max(ih - vh, 0));
    }

    // Fallback handler for browsers without visualViewport
    function onWindowResize() {
      const delta = initialHeight - window.innerHeight;
      setKeyboardHeight(Math.max(delta, 0));
    }

    // Subscribe to both events
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", onVisualResize);
    }
    window.addEventListener("resize", onWindowResize);

    // Initialize value on mount
    if (window.visualViewport) {
      onVisualResize();
    } else {
      onWindowResize();
    }

    // Cleanup subscriptions on unmount
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", onVisualResize);
      }
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  return keyboardHeight;
}
