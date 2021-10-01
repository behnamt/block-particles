import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Particles from './Particles';
import WalletConnect from './WalletConnect';

const InputWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
const StyledInput = styled.input`
  margin-top: 20px;
  font-size: 30px;
  height: 70px;
  width: 200px;
`;

function App() {

  const { account, library: web3 } = useWeb3React();
  const [blockNumber, setBlockNumber] = useState('latest');
  const [hashes, setHashes] = useState([]);

  useEffect(() => {
    if (web3 && account) {
      web3.eth.getBlock(blockNumber).then(block => setHashes(block.transactions))
    }
  }, [web3, account, blockNumber]);

  const handleKeyPress = ({code, target}) => {
    if (code === 'Enter') {
      if (!isNaN(parseInt(target.value))){
        setBlockNumber(target.value);
      } else {
        setBlockNumber('latest');
      }
    }
  }

  return (
    <React.Fragment>
      { account && hashes ?
        (
          <React.Fragment>
            <Particles hashes={hashes}/>
            <InputWrapper>
              <StyledInput onKeyPress={handleKeyPress} placeholder="block number" title="press enter to apply"/>
            </InputWrapper>
          </React.Fragment>
        ) :
        (
          <WalletConnect />    
        )
      }
    </React.Fragment>
    
  );
}

export default App;