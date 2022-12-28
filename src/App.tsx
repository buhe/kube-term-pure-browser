import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ReactTerminal } from "react-terminal";
import { TerminalContextProvider } from "react-terminal";
import { Exec } from './kube/exec';
import { KubeConfig } from './kube/config';
const kc = new KubeConfig();
kc.loadFromDefault();
let exec = new Exec(kc)

function App() {
  return (
    <div className="App">
          <TerminalContextProvider>
            <ReactTerminal
              commands={{}}
              showControlBar={false}
              theme={"dark"}
              defaultHandler={async (command: any, commandArguments: any) => {
                // return `${command} ${commandArguments} via ws`;
                await exec.exec('default', 'nginx-4217019353-9gl4s', 'nginx', 'sh', `${command} ${commandArguments}`, (output) => {
                  // output
                  
                 }, true /* tty */,
                  (status: any) => {
                    // tslint:disable-next-line:no-console
                    console.log('Exited with status:');
                    // tslint:disable-next-line:no-console
                    console.log(JSON.stringify(status, null, 2));
                  })
              }}
            />
          </TerminalContextProvider>
          
        
    </div>
  );
}

export default App;
