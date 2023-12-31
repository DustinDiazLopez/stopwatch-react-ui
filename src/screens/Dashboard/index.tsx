import React, {ReactElement, useState} from 'react';

import * as utils from '../../utils';
import Stopwatch from "../../components/Stopwatch";
import Timer from "../../components/Timer";

import './style.css';

const Dashboard: React.FC<unknown> = (): ReactElement => {
  const [isMuted, setIsMuted] = useState(false);
  const [commonParserFunctions,] = useState(() => {
    return [
      {
        key: 'eq',
        value: (a: number, b: number) => a === b,
      },
      {
        key: 'neq',
        value: (a: number, b: number) => a !== b,
      },
      {
        key: 'toSeconds',
        value: (value: number) => {
          return value / 1000;
        },
      },
      {
        key: 'toMinutes',
        value: (value: number) => {
          return value / 60 / 1000;
        },
      },
      {
        key: 'toHours',
        value: (value: number) => {
          return value / 60 / 60 / 1000;
        },
      },
      {
        key: 'mod',
        value: (value: number, t: number) => value % t,
      },
    ];
  });
  const [expression,] = useState(
    '$all($neq($smallTime, 0), $eq($mod($smallTime, 30 * 1000), 0))'
  );

  const [timers,] = useState([])
  return (
    <div className="App">
      <button onClick={() => setIsMuted(!isMuted)}>{isMuted ? 'Un-Mute' : 'Mute'}</button>
      {timers.map(() => <Timer mute={isMuted}/>)}
      <Stopwatch
        granularityMs={1000}
        updateWindowTile={true}
        mute={isMuted}

        beepTriggers={[
          {
            frequency: 1040,
            volume: 1,
            duration: 1000,
            condition: (bigTime, smallTime) => {
              const {result, logs} = utils.evaluate(
                expression,
                commonParserFunctions,
                [
                  {
                    key: 'bigTime',
                    value: bigTime,
                  },
                  {
                    key: 'smallTime',
                    value: smallTime,
                  }
                ],
              );

              logs?.forEach((log) => {
                const debugLog = {
                  expression,
                  bigTime,
                  smallTime,
                  debug: {
                    lineNumber: log.lineNumber,
                    error: log.error,
                  },
                };

                const msg = log.message;
                if (log.level === 'WARN') {
                  console.warn('[eval]', msg, debugLog);
                } else if (log.level === 'ERROR') {
                  console.error('[eval]', msg, debugLog);
                }
              });

              return utils.isTrue(result);
            },
          }
        ]}
      />
    </div>
  );
};

export default Dashboard;
