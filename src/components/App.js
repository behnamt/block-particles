import { useWeb3React } from '@web3-react/core';
import React from 'react';
import { Switch, Route } from "react-router-dom";
import WalletConnect from './WalletConnect';
import ParticlesPage from '../pages/ParticlesPage';
import SystemPage from '../pages/SystemPage';

function App() {

  const { account } = useWeb3React();

  return (
    <React.Fragment>
      {account ?
        (
          <Switch>
            <Route path="/particles/:block">
              <ParticlesPage />
            </Route>
            <Route path="/system">
              <SystemPage />
            </Route>
            <Route path="/system/:block">
              <SystemPage />
            </Route>
            <Route path="/">
              <ParticlesPage />
            </Route>

          </Switch>
        ) :
        (
          <WalletConnect />
        )
      }
    </React.Fragment>

  );
}

export default App;