import React, {ReactElement, useState} from 'react';
import Stopwatch from "./components/Stopwatch";

import './App.css';
import Timer from "./components/Timer";

const App: React.FC<unknown> = (): ReactElement => {
  const [mute,] = useState(false);
  return (
    <div className="App">
      <Timer mute={mute} />
      <Stopwatch
        granularityMs={1000}
        updateWindowTile={true}
        mute={mute}

        beepTriggers={[
          {
            // type: 'beep4',

            frequency: 1040,
            volume: 1,
            duration: 1000,
            condition: (bigTime, smallTime) => smallTime !== 0 && smallTime % (30 * 1000) === 0, // every second
          }
        ]}
      />

    </div>
  );
};

export default App;
