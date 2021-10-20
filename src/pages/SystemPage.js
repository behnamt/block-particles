import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import System from '../components/System';
import useExtractPlant from '../hooks/useExtractPlant';
import BN from 'bn.js';

const WrapperDiv = styled.div`
    width: ${props => props.canvasSize}px;
    height: ${props => props.canvasSize}px;
    box-shadow: #525252 6px 6px;
    cursor: pointer;
    background: #969696;
    margin: 0 auto;
`

const CANVAS_SIZE = 700; // in px
const HASH_SPLITTER = 2;

function SystemPage() {

  const { getPlanet, getSun, normalize } = useExtractPlant({ CANVAS_SIZE, HASH_SPLITTER })
  let { block } = useParams();
  const { account, library: web3 } = useWeb3React();
  const [blockNumber, setBlockNumber] = useState(block || 'latest');

  const [rawPlanets, setRawPlanets] = useState({ zeroPlanets: [], fatPlanets: [] })
  const [planetsWithMoon, setPlanetsWithMoons] = useState([]);
  const [sun, setSun] = useState({ size: 0, tx: '', emptyDistance: 0 });
  const [transactions, setTransactions] = useState([]);

  const setSunProperties = ({ gasUsed, hash }) => {
    const bnGasUsed = new BN(gasUsed);
    const sunSize = Math.round(Math.log(bnGasUsed.toNumber()));
    const {emptyDistance} = getSun({ tx: hash, sunSize})
    setSun({ size: sunSize, tx: hash, emptyDistance });
    return sunSize;
  }

  const getRawPlanets = async ({ transactions }) => {
    const zeroPlanets = [];
    const fatPlanets = [];
    for await (const tx of transactions) {
      const hashData = await web3.eth.getTransaction(tx);
      hashData.value === '0' ?
       zeroPlanets.push(hashData.hash) : 
       fatPlanets.push({ tx: hashData.hash, value: hashData.value });
    }
    setRawPlanets({zeroPlanets, fatPlanets: extractDataAndSort(fatPlanets) });
  }

  const extractDataAndSort = (fatPlanets) => {
    return fatPlanets.map((planet) => getPlanet(planet, sun.size, sun.emptyDistance)).sort((a, b) => a.distance - b.distance);
  }

  const moonalize = () => {
    const moonalizedPlanets = [rawPlanets.fatPlanets[0]];
    rawPlanets.fatPlanets.forEach((planet, i) => {
      if (i > 0) {
        const lastPlanetWithMoon = moonalizedPlanets[moonalizedPlanets.length - 1];
        if (planet.distance - planet.radius <= lastPlanetWithMoon.distance + (lastPlanetWithMoon.radius * 2) &&
          planet.distance + planet.radius >= lastPlanetWithMoon.distance - (lastPlanetWithMoon.radius * 2)
        ) {
          const newDistance = normalize(5, (lastPlanetWithMoon.radius * 6), planet.distance);
          if (moonalizedPlanets[moonalizedPlanets.length - 1].children) {
            if (moonalizedPlanets[moonalizedPlanets.length - 1].radius < planet.radius) {
              const { children, ...rest } = moonalizedPlanets[moonalizedPlanets.length - 1];
              moonalizedPlanets[moonalizedPlanets.length - 1] = planet;
              planet.children = children.concat([{ ...rest, distance: newDistance }])
            } else {
              moonalizedPlanets[moonalizedPlanets.length - 1].children.push({ ...planet, distance: newDistance })
            }
          } else {
            moonalizedPlanets[moonalizedPlanets.length - 1].children = [
              { ...planet, distance: newDistance }
            ]
          }
        } else {
          moonalizedPlanets.push(planet)
        }
      }
    });
    moonalizedPlanets.forEach(planet => {
      if (planet?.children?.length) {
        let newPlanetRadius = planet.radius;
        planet.children = planet.children.map(moon => {
          newPlanetRadius += moon.radius * 0.1;
          return {
            ...moon,
            radius: moon.radius * 0.9,
          }
        })
        planet.radius = Math.min(newPlanetRadius, sun.size);
      }
    })
    setPlanetsWithMoons(moonalizedPlanets);
  }

  useEffect(() => {
    (async () => {
      if (web3 && account) {
        const { transactions, gasUsed, hash } = await web3.eth.getBlock(blockNumber);
        setSunProperties({ gasUsed, hash });
        setTransactions(transactions);
      }
    })();

  }, [web3, account, blockNumber]);

  useEffect(() => {
    if (sun?.size && transactions.length){
      getRawPlanets({transactions});
    }
  }, [sun, transactions])

  useEffect(() => {
    if (rawPlanets.zeroPlanets.length || rawPlanets.fatPlanets.length){
      moonalize();
    }
  }, [rawPlanets])

  return (
    <WrapperDiv canvasSize={CANVAS_SIZE}>
      {sun.size > 0 && planetsWithMoon.length && (
        <System sun={sun} planets={planetsWithMoon} canvasSize={CANVAS_SIZE} />
      )}
    </WrapperDiv>
  )
}

export default SystemPage;