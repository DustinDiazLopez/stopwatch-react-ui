import React, {useState, useEffect, ReactElement} from 'react';
import {beeps, DefaultBeeps, playBeep} from "../../utils/sound";
import {updateStopwatchDisplay} from "../../utils";

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

const Stopwatch: React.FC<TimerProps> = ({
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
  const showMs = intervalTime % 1000 !== 0;

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
      document.title = updateStopwatchDisplay(time, showMs);
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
  }, [time, running, updateWindowTile, mute, beepTriggers, splitTime, showMs]);

  return (
    <div>
      <p>{updateStopwatchDisplay(time, showMs)}</p>
      <p>{updateStopwatchDisplay(splitTime, showMs)}</p>
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
          const smallTime = updateStopwatchDisplay(split.smallTime, showMs);
          const bigTime = updateStopwatchDisplay(split.bigTime, showMs);

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

export default Stopwatch;
