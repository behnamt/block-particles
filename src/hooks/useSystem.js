import { useWeb3React } from "@web3-react/core";
import { CANVAS_SIZE, DISTANCE_MULT } from "../constants/numbers";
import useExtractPlant from "./useExtractPlant";

export const useSystem = () => {
  const { getPlanet, getSun, getAstroid } = useExtractPlant()
  const { library: web3 } = useWeb3React();


  const extractPlanetDataAndSort = (sunSize,fatPlanets) => {
    return fatPlanets.map((planet) => getPlanet(planet, sunSize)).sort((a, b) => a.distance - b.distance);
  }

  const extractAstroidData = (zeroPlanets, sun) => {
    return zeroPlanets.map((astroid) => getAstroid(astroid, sun));
  }

  const getSunProperties = ({ gasUsed, hash }) => {
    const {sunSize, ...rest} = getSun({ tx: hash, gasUsed })
     return { size: sunSize, tx: hash, ...rest };
  }

  const getRawPlanets = async ({ sun, transactions }) => {
    const zeroPlanets = [];
    const fatPlanets = [];
    for await (const tx of transactions) {
      const hashData = await web3.eth.getTransaction(tx);
      hashData.value === '0' ?
        zeroPlanets.push(hashData.hash) :
        fatPlanets.push({ tx: hashData.hash, value: hashData.value });
    }
    return { zeroPlanets: extractAstroidData(zeroPlanets, sun), fatPlanets: extractPlanetDataAndSort(sun.size, fatPlanets) };
  }

  const areTwoPlanetsNear = (planetA, multA = 1, planetB, multB = 1) => {
    const lowerBoundPlantA = planetA.distance - (planetA.radius * multA);
    const upperBoundPlanetA = planetA.distance + (planetA.radius * multA);
    const lowerBoundPlanetB = planetB.distance - (planetB.radius * multB);
    const upperBoundPlanetB = planetB.distance + (planetB.radius * multB);

    return (upperBoundPlanetB >= lowerBoundPlantA && upperBoundPlanetB <= upperBoundPlanetA) || 
    (lowerBoundPlanetB >=lowerBoundPlantA && lowerBoundPlanetB <= lowerBoundPlantA)
  
  }

  const moonalize = (plantesWithAstroids) => {
    let initialMoonalized = [plantesWithAstroids[0]];

    plantesWithAstroids.forEach((planet, i) => {
      if (i > 0) {
        const lastPlanetWithMoon = initialMoonalized[initialMoonalized.length - 1];
        if (areTwoPlanetsNear(planet, DISTANCE_MULT, lastPlanetWithMoon)) {

          if (!lastPlanetWithMoon.children) {
            initialMoonalized[initialMoonalized.length - 1].children = [];
          }
          initialMoonalized[initialMoonalized.length - 1].children.push(planet)
          
        } else {
          initialMoonalized.push(planet)
        }
      }
    });

    return initialMoonalized;
  }

  const moonify = (moonalizedPlanets, sunSize) => {

    moonalizedPlanets.forEach(planet => {
      if (planet?.children?.length) {
        planet.children = planet.children.sort((a,b)=> a.radius - b.radius);

        const biggestMoon = planet.children[planet.children.length-1];

        // exchange radius with the biggest moon
        if (biggestMoon.radius > planet.radius) {
          planet.radius += biggestMoon.radius;
          planet.children[planet.children.length-1].radius = planet.radius - planet.children[planet.children.length-1].radius;
          planet.radius -= planet.children[planet.children.length-1].radius;
        }
        let newPlanetRadius = planet.radius;
        
        planet.children = planet.children.map((moon, i) => {
          newPlanetRadius += moon.radius * 0.2;
          const distance = (planet.radius * DISTANCE_MULT * (i+1)) / planet.children.length;

          return {
            ...moon,
            distance,
            radius: moon.radius * 0.8,
          }
        })
        planet.radius = Math.min(newPlanetRadius, sunSize);
      }
    })
    return moonalizedPlanets;
  }

  const astroidiez = ({rawPlanets, astroidsLocation}) => {
    const astroidsWidth = astroidsLocation.end - astroidsLocation.start;
    const planets = rawPlanets.fatPlanets.map(planet => {
      if (planet.distance > astroidsLocation.start) {
        return {
          ...planet,
          distance: Math.min(planet.distance + astroidsWidth, CANVAS_SIZE/2)
        }
      }
      return planet;
    })
    return [planets, rawPlanets.zeroPlanets];
  }


  return {
    getSunProperties,
    getRawPlanets,
    moonalize,
    moonify,
    astroidiez,
  }
}