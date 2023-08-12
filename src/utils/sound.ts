export function playBeep(duration: number, frequency: number, volume: number) {
  const audioContext = new window.AudioContext();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration / 1000);

  oscillator.stop(audioContext.currentTime + duration / 1000 + 0.1);
}

export const beeps = {
  beep1: () => {
    playBeep(300, 140, 0.5);
  },
  beep2: () => {
    playBeep(300, 240, 0.5);
  },
  beep3: () => {
    playBeep(300, 340, 0.5);
  },
  beep4: () => {
    playBeep(300, 440, 0.5);
  },
  beep5: () => {
    playBeep(300, 540, 0.5);
  },
  beep6: () => {
    playBeep(300, 640, 0.5);
  },
  beep7: () => {
    playBeep(300, 740, 0.5);
  },
  beep8: () => {
    playBeep(300, 840, 0.5);
  },
  beep9: () => {
    playBeep(300, 940, 0.5);
  },
};

export type DefaultBeeps = keyof typeof beeps;
