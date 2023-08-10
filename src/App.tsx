import React, {ReactElement} from 'react';
import Stopwatch from "./components/Stopwatch";

import './App.css';

const App: React.FC<unknown> = (): ReactElement => {
  return (
    <div className="App">
      <Stopwatch
        granularityMs={1}
        updateWindowTile={true}
        mute={true}

        beepTriggers={[
          {
            // type: 'beep4',

            // frequency: 440,
            // volume: 0.5,
            // duration: 300,
            condition: (ms) => ms % 1000 === 0, // every second
          }
        ]}
      />
    </div>
  );
};

export default App;
