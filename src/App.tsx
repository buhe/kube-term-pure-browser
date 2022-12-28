import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ReactTerminal } from "react-terminal";
import { TerminalContextProvider } from "react-terminal";


function App() {
  return (
    <div className="App">
          <TerminalContextProvider>
            <ReactTerminal
              commands={{}}
              defaultHandler={(command: any, commandArguments: any) => {
                return `${command} us ws`;
              }}
            />
          </TerminalContextProvider>
          
        
    </div>
  );
}

export default App;
