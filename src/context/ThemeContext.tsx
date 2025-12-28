"use client";

import type React from "react";
import { createContext, useState, useContext, useEffect, useCallback } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  isAutoMode: boolean;
  enableAutoMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Calculate sunrise and sunset times using simplified sun position algorithm
const getSunTimes = (date: Date, latitude: number, longitude: number) => {
  const rad = Math.PI / 180;
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  );

  // Solar declination angle
  const declination = -23.45 * Math.cos(rad * (360 / 365) * (dayOfYear + 10));

  // Hour angle for sunrise/sunset (when sun is at horizon, -0.833 degrees for atmospheric refraction)
  const cosHourAngle =
    (Math.cos(rad * 90.833) - Math.sin(rad * latitude) * Math.sin(rad * declination)) /
    (Math.cos(rad * latitude) * Math.cos(rad * declination));

  // Clamp to valid range for polar regions
  const clampedCosHourAngle = Math.max(-1, Math.min(1, cosHourAngle));
  const hourAngle = Math.acos(clampedCosHourAngle) / rad;

  // Solar noon in hours (UTC)
  const solarNoon = 12 - longitude / 15;

  // Sunrise and sunset times in hours (UTC)
  const sunriseUTC = solarNoon - hourAngle / 15;
  const sunsetUTC = solarNoon + hourAngle / 15;

  // Convert to local time
  const timezoneOffset = -date.getTimezoneOffset() / 60;
  const sunriseLocal = sunriseUTC + timezoneOffset;
  const sunsetLocal = sunsetUTC + timezoneOffset;

  // Create Date objects for sunrise and sunset
  const sunrise = new Date(date);
  sunrise.setHours(Math.floor(sunriseLocal), Math.round((sunriseLocal % 1) * 60), 0, 0);

  const sunset = new Date(date);
  sunset.setHours(Math.floor(sunsetLocal), Math.round((sunsetLocal % 1) * 60), 0, 0);

  return { sunrise, sunset };
};

// Estimate coordinates from timezone offset
// Longitude is calculated from timezone (each hour = 15 degrees)
// Latitude uses a moderate value (30°) for reasonable sunrise/sunset times
const getCoordinatesFromTimezone = (): { latitude: number; longitude: number } => {
  const now = new Date();
  const timezoneOffsetHours = -now.getTimezoneOffset() / 60; // e.g., UTC+7 = 7

  // Longitude: timezone offset * 15 degrees per hour
  const longitude = timezoneOffsetHours * 15; // e.g., UTC+7 → 105° East

  // Use a moderate latitude (30°) which gives reasonable ~6am sunrise, ~6pm sunset
  // This works well for most populated areas
  const latitude = 30;

  return { latitude, longitude };
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>("light");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(true);

  // Get coordinates based on user's timezone
  const coordinates = getCoordinatesFromTimezone();

  // Helper function to check if it's currently Day or Night based on sunrise/sunset
  const getDaylightTheme = useCallback((): Theme => {
    const now = new Date();
    const { sunrise, sunset } = getSunTimes(now, coordinates.latitude, coordinates.longitude);

    // It's daytime if current time is between sunrise and sunset
    const isDayTime = now >= sunrise && now < sunset;
    return isDayTime ? "light" : "dark";
  }, [coordinates.latitude, coordinates.longitude]);

  useEffect(() => {
    // This code will only run on the client side
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const savedAutoMode = localStorage.getItem("autoThemeMode");

    // IF user has explicitly disabled auto mode, use their saved theme
    // ELSE, calculate based on sunrise/sunset
    if (savedAutoMode === "false" && savedTheme) {
      setTheme(savedTheme);
      setIsAutoMode(false);
    } else {
      setTheme(getDaylightTheme());
      setIsAutoMode(true);
    }

    setIsInitialized(true);
  }, [getDaylightTheme]);

  useEffect(() => {
    if (isInitialized) {
      // We ONLY update the DOM classes here.
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme, isInitialized]);

  // Auto-update theme based on sunrise/sunset when in auto mode
  useEffect(() => {
    if (!isAutoMode || !isInitialized) return;

    // Check every minute for sunrise/sunset transition
    const intervalId = setInterval(() => {
      const newTheme = getDaylightTheme();
      if (newTheme !== theme) {
        setTheme(newTheme);
      }
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [isAutoMode, isInitialized, getDaylightTheme, theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    // When user manually toggles, disable auto mode and save preference
    setIsAutoMode(false);
    localStorage.setItem("theme", newTheme);
    localStorage.setItem("autoThemeMode", "false");
  };

  const enableAutoMode = () => {
    setIsAutoMode(true);
    localStorage.setItem("autoThemeMode", "true");
    localStorage.removeItem("theme");
    // Immediately apply the correct theme based on current time
    setTheme(getDaylightTheme());
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isAutoMode, enableAutoMode }}>
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