import { ReactP5Wrapper } from 'react-p5-wrapper';
import PlanetBody from '../p5/PlanetBody';

function System({ sun, planets, canvasSize }) {
  const sketh = (p) => {
    let sunPlanet;

    let zoom = 1;
    let drag;
    let prevMouse;


    p.setup = () => {
      drag = p.createVector(0, 0);

      p.createCanvas(canvasSize, canvasSize, p.WEBGL);

      sunPlanet = new PlanetBody({ p, drag, radius: sun.size, distance: 0, parent: null, planet: false, emission: p.color(255), color: p.color(255) });
      planets.forEach(planet => {
        const _planetBody = new PlanetBody({
          p,
          drag,
          theta: planet.theta,
          speed: planet.speed,
          radius: planet.radius,
          distance: planet.distance,
          parent: sunPlanet,
          emission: null,
          color: planet.color,
          planet: true
        })
        if (planet.children?.length ){
          planet.children.forEach(moon=>{
            new PlanetBody({
              p,
              drag,
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
      });
    }

    p.draw = () => {
      p.background(0);

      p.noStroke();
      p.ambientMaterial(255);
      p.ambientLight(42);

      p.orbitControl();

      sunPlanet.update();
      sunPlanet.draw();
    }

    p.mousePressed = () => {
      prevMouse = p.createVector(p.mouseX, p.mouseY);
    }

    p.mouseWheel = (event) => {
      zoom += event.delta * 0.0001;
    }
  }
  return <ReactP5Wrapper sketch={sketh} />
}

export default System;