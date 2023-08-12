import { useState, useEffect } from 'react';
import {playBeep} from "../utils/sound";

export const useInterval = (callback: any, delay: number) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isActive) {
      const intervalId = setInterval(callback, delay);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isActive, callback, delay]);

  return {
    isActive,
    toggle: () => setIsActive(!isActive),
    on: () => setIsActive(true),
    off: () => setIsActive(false),
  };
};

export const useAlarm = (
  delayBetweenBeeps: number,
  duration: number,
  frequency: number,
  volume: number,
) => {
  return useInterval(() => {
    playBeep(duration, frequency, volume);
  }, delayBetweenBeeps);
};

