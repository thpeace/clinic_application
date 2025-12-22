"use client";

import type React from "react";
import { createContext, useState, useContext, useEffect } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>("light");
  const [isInitialized, setIsInitialized] = useState(false);

  // Helper function to check if it's currently Day or Night
  const getDaylightTheme = (): Theme => {
    const now = new Date();
    const hours = now.getHours();
    // Use Light mode between 6 AM (6) and 6 PM (18)
    const isDayTime = hours >= 6 && hours < 18;
    return isDayTime ? "light" : "dark";
  };

  useEffect(() => {
    // This code will only run on the client side
    const savedTheme = localStorage.getItem("theme") as Theme | null;

    // IF user has a saved preference, use it.
    // ELSE, calculate based on the time of day.
    const initialTheme = savedTheme || getDaylightTheme();

    setTheme(initialTheme);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      // We ONLY update the DOM classes here.
      // We do NOT save to localStorage here anymore.
      // This keeps "Auto Mode" active until the user manually toggles.
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme, isInitialized]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    // We only save to storage when the User explicitily clicks the button
    localStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};