import React, {useState, useEffect, ReactElement} from 'react';

function formatTime(time: number, len = 2) {
  return time.toString().padStart(len, '0');
}

function updateStopwatchDisplay(ms: number) {
  const milliseconds = ms % 1000;
  const seconds = Math.floor(ms / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(remainingSeconds)}.${formatTime(milliseconds, 3)}`;
}

function playBeep(duration: number, frequency: number, volume: number) {
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

const beeps = {
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

export type BeepDescriptor = {
  type?: DefaultBeeps,
  duration?: number,
  frequency?: number,
  volume?: number,
  condition: (mainTime: number, splitTime: number) => boolean,
};

export type TimerProps = {
  granularityMs?: number,
  updateWindowTile?: boolean,
  mute: boolean,
  beepTriggers?: BeepDescriptor[],
};

export type SplitTime = {
  bigTime: number,
  smallTime: number,
};

const Timer: React.FC<TimerProps> = ({
                                       mute,
                                       granularityMs,
                                       updateWindowTile,
                                       beepTriggers,
                                     }): ReactElement => {
  const [uid,] = useState(() => crypto.randomUUID());
  const [time, setTime] = useState(0)
  const [splitTime, setSplitTime] = useState(0)
  const [running, setRunning] = useState(false);
  const intervalTime = granularityMs || 1;

  // split
  const [splitTimes, setSplitTimes] = useState<SplitTime[]>([]);

  useEffect(() => {
    if (running) {
      const intervalId = setInterval(() => {
          setTime(time + intervalTime);
          setSplitTime(splitTime + intervalTime);
        },
        intervalTime,
      );

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [time, running, intervalTime, splitTime]);

  useEffect(() => {
    if (time === 0 || !running) {
      return;
    }

    if (updateWindowTile && time % 500 === 0) {
      document.title = updateStopwatchDisplay(time);
    }

    if (!mute) {
      beepTriggers?.forEach((desc) => {
        if (desc?.condition?.(time, splitTime)) {
          if (desc.type === undefined && (!desc.frequency && !desc.duration && !desc.volume)) {
            beeps.beep4();
            return;
          }

          if (desc.type && desc.type in beeps) {
            beeps[desc.type]();
            return;
          }

          playBeep(
            desc.duration || 300,
            desc.frequency || 440,
            desc.volume || 0.5
          );
        }
      });
    }
  }, [time, running, updateWindowTile, mute, beepTriggers, splitTime]);

  return (
    <div>
      <p>{updateStopwatchDisplay(time)}</p>
      <p>{updateStopwatchDisplay(splitTime)}</p>
      <button
        onClick={() => {
          setRunning(!running);
        }}
      >
        {running ? 'Pause' : 'Start'}
      </button>
      <button
        onClick={() => {
          setSplitTimes([
            {
              bigTime: time,
              smallTime: splitTime,
            },
            ...splitTimes,
          ]);
          setSplitTime(0);
        }}
      >
        {'Split'}
      </button>
      <button
        onClick={() => {
          setTime(0);
          setSplitTime(0);
          setSplitTimes([]);
        }}
      >
        {'Reset'}
      </button>
      <table>
        <tbody>
        {splitTimes?.map((split, index, arr) => {
          const key = `split-time-${uid}-${split.smallTime}-${split.bigTime}`;
          const smallTime = updateStopwatchDisplay(split.smallTime);
          const bigTime = updateStopwatchDisplay(split.bigTime);

          return (
            <tr key={key}>
              <td>
                #{arr.length - index}
              </td>
              <td>
                {smallTime}
              </td>
              <td>
                {bigTime}
              </td>
            </tr>
          );
        })}
        </tbody>
      </table>
    </div>
  );
};

export default Timer;
