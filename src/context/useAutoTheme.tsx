import { useEffect, useState } from 'react';

// You can adjust these hours to fit your preference
const SUNRISE_HOUR = 6; // 6:00 AM
const SUNSET_HOUR = 18; // 6:00 PM

type Theme = 'light' | 'dark';

export const useAutoTheme = () => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const calculateTheme = () => {
      const now = new Date();
      const currentHour = now.getHours();

      // Logic: If it is AFTER sunrise AND BEFORE sunset, use Light mode.
      const isDayTime = currentHour >= SUNRISE_HOUR && currentHour < SUNSET_HOUR;

      const newTheme = isDayTime ? 'light' : 'dark';
      
      setTheme(newTheme);
      applyTheme(newTheme);
    };

    // 1. Calculate immediately on mount
    calculateTheme();

    // 2. Set up a timer to check every minute (60000ms)
    // This ensures if the user keeps the site open during sunset, it switches automatically.
    const interval = setInterval(calculateTheme, 60000);

    return () => clearInterval(interval);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement;
    
    // Remove the old class and add the new one
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);
  };

  return { theme };
};