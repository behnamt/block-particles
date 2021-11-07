/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import System from '../components/System';
import System2D from '../components/System2D';
import { CANVAS_SIZE } from '../constants/numbers';
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


function SystemPage({ is2D }) {

  let { block } = useParams();
  const { account, library: web3 } = useWeb3React();
  const {
    getSunProperties,
    getRawPlanets,
    moonalize,
    moonify,
    astroidiez,
  } = useSystem();

  const [blockNumber, setBlockNumber] = useState(block || 'latest');
  const [rawPlanets, setRawPlanets] = useState({ zeroPlanets: [], fatPlanets: [] })
  const [plantesWithAstroids, setPlantesWithAstroids] = useState([]);
  const [astroids, setAstroids] = useState([]);
  const [moonalizedPlanets, setMoonalizedPlanets] = useState([]);
  const [planetsWithMoon, setPlanetsWithMoons] = useState([]);
  const [sun, setSun] = useState({ size: 0, astroidsStart: 0, astroidsEnd: 0 });
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
        const raw = await getRawPlanets({ 
          sun,
          transactions,
        });
        setRawPlanets(raw);
      }
    })();
  }, [sun, transactions])

  useEffect(() => {
    if (rawPlanets?.zeroPlanets?.length || rawPlanets?.fatPlanets?.length) {
      const [planets, astroids] = astroidiez({rawPlanets, astroidsLocation: {start: sun.astroidsStart, end: sun.astroidsEnd}});
      setPlantesWithAstroids(planets);
      setAstroids(astroids);
    }
  }, [rawPlanets])

  useEffect(() => {
    if (plantesWithAstroids?.length) {
      setMoonalizedPlanets(moonalize(plantesWithAstroids));
    }
  }, [plantesWithAstroids])

  useEffect(() => {
    if (moonalizedPlanets.length) {
      setPlanetsWithMoons(moonify(moonalizedPlanets, sun.size));
    }
  }, [moonalizedPlanets])

  return (
    <React.Fragment>
      <WrapperDiv canvasSize={CANVAS_SIZE}>
        {sun.size > 0 && planetsWithMoon.length && (
          is2D ? (
            <System2D sun={sun} planets={planetsWithMoon} astroids={astroids} canvasSize={CANVAS_SIZE} />
          ) : (
            <System sun={sun} planets={planetsWithMoon} astroids={astroids} canvasSize={CANVAS_SIZE} />
          )
        )}
      </WrapperDiv>
      <InputWrapper>
        <StyledInput onKeyPress={handleKeyPress} defaultValue={blockNumber} placeholder="block number" title="press enter to apply" />
      </InputWrapper>
    </React.Fragment>

  )
}

export default SystemPage;