import React, {ReactElement, useEffect, useState} from 'react';
import {updateStopwatchDisplay} from "../../utils";
import {useAlarm} from "../../hooks";


export type TimerProps = {
  mute?: boolean,
};

const Timer: React.FC<TimerProps> = ({
                                       mute,
                                     }): ReactElement => {

  const [running, setRunning] = useState(false);
  const [originalTime, setOriginalTime] = useState<number>();
  const [time, setTime] = useState(0);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState((4 * 60) * 1000);
  const [second, setSecond] = useState(30 * 1000);
  const alarm = useAlarm(250, 100, 500, 1);

  useEffect(() => {
    setTime(hour + minute + second);
  }, [hour, minute, second]);

  useEffect(() => {
    if (running) {
      const intervalId = setInterval(
        () => {
          setTime(time - 1000);
        },
        1000
      );

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [running, time]);

  useEffect(() => {
    if (running && time <= 0) {
      setRunning(false);

      if (!mute) {
        alarm.on();
      }
    }
  }, [alarm, mute, running, time]);

  return (
    <>
      <p className={'timer display'}>{(running || alarm.isActive) && updateStopwatchDisplay(time, false)}</p>

      {(!running && !alarm.isActive) && (
        <div className={'timer-body'}>
          <input
            className={'timer-input hour'}
            type={'number'}
            min={0}
            value={hour / 60 / 60 / 1000}
            onChange={(event) => {
              try {
                setHour(parseInt(event.target.value) * 60 * 60 * 1000);
              } catch (error) {
                console.error('Failed to set hour because of user error', error);
              }
            }}
          />
          :
          <input
            className={'timer-input minute'}
            type={'number'}
            min={0}
            max={60}
            value={minute / 60 / 1000}
            onChange={(event) => {
              try {
                setMinute(parseInt(event.target.value) * 60 * 1000);
              } catch (error) {
                console.error('Failed to set minutes because of user error', error);
              }
            }}
          />
          :
          <input
            className={'timer-input seconds'}
            type={'number'}
            min={0}
            max={60}
            value={second / 1000}
            onChange={(event) => {
              try {
                setSecond(parseInt(event.target.value) * 1000);
              } catch (error) {
                console.error('Failed to set seconds because of user error', error);
              }
            }}
          />
        </div>
      )}

      <div>
        <button
          className={'timer-input start-btn'}
          onClick={() => {
            if (alarm.isActive) {
              alarm.off();
              return;
            }

            const flip = !running;
            setRunning(flip);

            if (flip) {
              setOriginalTime(hour + minute + second);
            }
          }}
        >
          {running ? 'Pause' : (alarm.isActive ? 'Stop Alarm' : 'Start')}
        </button>
        <button
          className={'timer-input reset-btn'}
          onClick={() => {
            setRunning(false);
            originalTime && setTime(originalTime);
            alarm.off()
          }}
        >
          {'Reset'}
        </button>
      </div>

    </>
  );
};

export default Timer;
