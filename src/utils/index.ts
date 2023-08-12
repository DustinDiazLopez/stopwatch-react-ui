export function formatTime(time: number, len = 2) {
  return time.toString().padStart(len, '0');
}

export function updateStopwatchDisplay(ms: number, showMs: boolean = true) {
  const milliseconds = ms % 1000;
  const seconds = Math.floor(ms / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  const msPart = showMs ? `.${formatTime(milliseconds, 3)}` : '';
  return `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(remainingSeconds)}` + msPart;
}
