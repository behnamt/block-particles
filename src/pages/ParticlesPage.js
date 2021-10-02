import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import Particles from '../components/Particles';

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

function ParticlesPage() {
  let { block } = useParams();
  const { account, library: web3 } = useWeb3React();
  const [blockNumber, setBlockNumber] = useState(block || 'latest');
  const [hashes, setHashes] = useState([]);

  useEffect(() => {
    if (web3 && account) {
      web3.eth.getBlock(blockNumber).then(block => setHashes(block.transactions))
    }
  }, [web3, account, blockNumber]);

  const handleKeyPress = ({ code, target }) => {
    if (code === 'Enter') {
      if (!isNaN(parseInt(target.value))) {
        setBlockNumber(target.value);
      } else {
        setBlockNumber('latest');
      }
    }
  }

  return (
     hashes && (
      <React.Fragment>
        <Particles hashes={hashes} />
        <InputWrapper>
          <StyledInput onKeyPress={handleKeyPress} defaultValue={blockNumber} placeholder="block number" title="press enter to apply" />
        </InputWrapper>
      </React.Fragment>
    )      
  );
}

export default ParticlesPage;