/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import System from '../components/System2D';
import { useSystem } from '../hooks/useSystem';

const WrapperDiv = styled.div`
    width: ${props => props.canvasSize}px;
    height: ${props => props.canvasSize}px;
    box-shadow: #525252 6px 6px;
    cursor: pointer;
    background: #969696;
    margin: 0 auto;
`;

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

const CANVAS_SIZE = 700; // in px
const HASH_SPLITTER = 2;
const DISTANCE_MULT = 4;

function SystemPage() {

  let { block } = useParams();
  const { account, library: web3 } = useWeb3React();
  const {
    getSunProperties,
    getRawPlanets,
    moonalize,
    moonify,
  } = useSystem(CANVAS_SIZE, HASH_SPLITTER, DISTANCE_MULT);

  const [blockNumber, setBlockNumber] = useState(block || 'latest');
  const [rawPlanets, setRawPlanets] = useState({ zeroPlanets: [], fatPlanets: [] })
  const [moonalizedPlanets, setMoonalizedPlanets] = useState([]);
  const [planetsWithMoon, setPlanetsWithMoons] = useState([]);
  const [sun, setSun] = useState({ size: 0, tx: '', emptyDistance: 0 });
  const [transactions, setTransactions] = useState([]);

  const handleKeyPress = ({ code, target }) => {
    if (code === 'Enter') {
      if (!isNaN(parseInt(target.value))) {
        setBlockNumber(target.value);
      } else {
        setBlockNumber('latest');
      }
    }
  }

  useEffect(() => {
    (async () => {
      if (web3 && account) {
        const { transactions, gasUsed, hash } = await web3.eth.getBlock(blockNumber);
        setSun(getSunProperties({ gasUsed, hash }));
        setTransactions(transactions);
      }
    })();

  }, [web3, account, blockNumber]);

  useEffect(() => {
    (async () => {
      if (sun?.size && transactions.length) {
        const raw = await getRawPlanets({ sunSize: sun.size, transactions });
        setRawPlanets(raw);
      }
    })();
  }, [sun, transactions])

  useEffect(() => {
    if (rawPlanets?.zeroPlanets?.length || rawPlanets?.fatPlanets?.length) {
      setMoonalizedPlanets(moonalize(rawPlanets));
    }
  }, [rawPlanets])

  useEffect(() => {
    if (moonalizedPlanets.length) {
      setPlanetsWithMoons(moonify(moonalizedPlanets, sun.size));
    }
  }, [moonalizedPlanets])

  return (
    <React.Fragment>
      <WrapperDiv canvasSize={CANVAS_SIZE}>
        {sun.size > 0 && planetsWithMoon.length && (
          <System sun={sun} planets={planetsWithMoon} canvasSize={CANVAS_SIZE} />
        )}
      </WrapperDiv>
      <InputWrapper>
        <StyledInput onKeyPress={handleKeyPress} defaultValue={blockNumber} placeholder="block number" title="press enter to apply" />
      </InputWrapper>
    </React.Fragment>

  )
}

export default SystemPage;