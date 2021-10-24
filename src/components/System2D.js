/* eslint-disable no-unused-vars */
import { ReactP5Wrapper } from 'react-p5-wrapper';
import PlanetBody from '../p5/Planet2D';

function System({ sun, planets, canvasSize }) {
  const sketh = (p) => {
    let sunPlanet;

    p.setup = () => {
      p.createVector(0, 0);

      p.createCanvas(canvasSize, canvasSize);

      sunPlanet = new PlanetBody({
        p,
        radius: sun.size,
        distance: 0,
        parent: null,
        planet: false,
        emission: p.color(255),
        color: p.color(255),
      });

      planets.forEach(planet => {
        const _planetBody = new PlanetBody({
          p,
          theta: planet.theta,
          speed: planet.speed,
          radius: planet.radius,
          distance: planet.distance,
          parent: sunPlanet,
          emission: null,
          color: planet.color,
          planet: true,
          tailLength: planet.tailLength,
        })
        if (planet.children?.length ){
          planet.children.forEach(moon=>{
            new PlanetBody({
              p,
              theta: moon.theta,
              speed: moon.speed,
              radius: moon.radius,
              distance: moon.distance,
              parent: _planetBody,
              emission: null,
              color: moon.color,
              planet: false,
            })
          })
        }
      })

    }

    p.draw = () => {
      p.translate(p.width / 2, p.height / 2);

      p.background(0);

      p.noStroke();

      sunPlanet.draw();
      sunPlanet.update(); 
    }


  }
  return <ReactP5Wrapper sketch={sketh} />
}

export default System;