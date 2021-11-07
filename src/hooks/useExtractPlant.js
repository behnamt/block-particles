import BN from 'bn.js';
import { CANVAS_SIZE, HASH_SPLITTER } from '../constants/numbers';
import useNumber from './useNumber';

const useExtractPlant = () => {

  const { hexToInt, normalize } = useNumber();
  const re = new RegExp(`.{1,${HASH_SPLITTER}}`, 'g');

  const getSun = ({ tx, gasUsed }) => {
    const bnGasUsed = new BN(gasUsed);
    const sunSize = Math.round(Math.log(bnGasUsed.toNumber()));

    const noZeroHash = tx.substring(2);
    const [_habitableStart, _habitableEnd, _astroidsStart, _astroidsEnd] = noZeroHash.match(re);
    const habitableStart = normalize(sunSize, (CANVAS_SIZE / 2), hexToInt(_habitableStart));
    const habitableEnd = normalize(habitableStart, (CANVAS_SIZE / 2), hexToInt(_habitableEnd));
    const astroidsStart = normalize(sunSize, (CANVAS_SIZE / 2), hexToInt(_astroidsStart));
    const astroidsEnd = normalize(astroidsStart, (CANVAS_SIZE / 2), hexToInt(_astroidsEnd));
    return { habitableStart, habitableEnd, astroidsStart, astroidsEnd, sunSize };
  }

  const getPlanet = ({ tx }, sunSize) => {
    const noZeroHash = tx.substring(2);

    const [_color1, _color2, _color3, _theta, _distance, _speed, _radius] = noZeroHash.match(re);

    const theta = normalize(0, 1, hexToInt(_theta));
    const distance = normalize(sunSize, CANVAS_SIZE / 2, hexToInt(_distance));
    const speed = normalize(1, 6, hexToInt(_speed));
    const radius = normalize(5, sunSize - 2, hexToInt(_radius));
    const tailLength = 90 * (radius / sunSize);

    return {
      color: {
        r: hexToInt(_color1),
        g: hexToInt(_color2),
        b: hexToInt(_color3),
      },
      theta,
      distance,
      speed,
      radius,
      tailLength
    };
  }

  const getAstroid = (tx, sun) => {
    const noZeroHash = tx.substring(2);

    const [
      _distance,
      _theta,
      _size,
      _point1X,
      _point1Y,
      _point2X,
      _point2Y,
      _point3X,
      _point3Y,
      _point4X,
      _point4Y,
      _point5X,
      _point5Y,
      _point6X,
      _point6Y,
    ] = noZeroHash.match(re);

    const theta = normalize(0, 1, hexToInt(_theta));
    const distance = normalize(sun.astroidsStart, sun.astroidsEnd, hexToInt(_distance));
    const size = normalize(4, 10, hexToInt(_size));
    const points = []
    const isShape = size >= 4;
    if (isShape) {
      points.push({
        x: Math.round(normalize(1, size, hexToInt(_point1X))),
        y: Math.round(normalize(1, size, hexToInt(_point1Y))),
      })
      points.push({
        x: Math.round(normalize(1, size, hexToInt(_point2X))),
        y: Math.round(normalize(1, size, hexToInt(_point2Y))),
      })
      points.push({
        x: Math.round(normalize(1, size, hexToInt(_point3X))),
        y: Math.round(normalize(1, size, hexToInt(_point3Y))),
      })
      points.push({
        x: Math.round(normalize(1, size, hexToInt(_point4X))),
        y: Math.round(normalize(1, size, hexToInt(_point4Y))),
      })
      points.push({
        x: Math.round(normalize(1, size, hexToInt(_point5X))),
        y: Math.round(normalize(1, size, hexToInt(_point5Y))),
      })
      points.push({
        x: Math.round(normalize(1, size, hexToInt(_point6X))),
        y: Math.round(normalize(1, size, hexToInt(_point6Y))),
      })
    }


    return {
      // color: {
      //   r: hexToInt(_color1),
      //   g: hexToInt(_color2),
      //   b: hexToInt(_color3),
      // },
      color: {
        r: 195,
        g: 160,
        b: 107,
      },
      theta,
      distance,
      size,
      points,
      isShape,
    };
  }

  return {
    getPlanet,
    getAstroid,
    normalize,
    getSun,
  }
}

export default useExtractPlant;