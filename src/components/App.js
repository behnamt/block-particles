import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Switch, Route } from "react-router-dom";
import WalletConnect from './WalletConnect';
import ParticlesPage from '../pages/ParticlesPage';

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