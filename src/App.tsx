import React, {ReactElement, useState} from 'react';
import Dashboard from "./screens/Dashboard";
import './App.css';

const App: React.FC<unknown> = (): ReactElement => {
  return (
    <div className="App">
      <Dashboard />
    </div>
  );
};

export default App;
