import BN from 'bn.js';

const useExtractPlant = ({ CANVAS_SIZE, HASH_SPLITTER, }) => {

  const HEX = 16;
  const MAX_INT = HASH_SPLITTER ** 8;
  const re = new RegExp(`.{1,${HASH_SPLITTER}}`, 'g');

  const getSun = ({ tx, gasUsed }) => {
    const bnGasUsed = new BN(gasUsed);
    const sunSize = Math.round(Math.log(bnGasUsed.toNumber()));

    const noZeroHash = tx.substring(2);
    const [_habitableStart, _habitableEnd, _astroidsStart, _astroidsEnd] = noZeroHash.match(re);
    const habitableStart = normalize(sunSize, (CANVAS_SIZE / 2) , parseInt(`0x${_habitableStart}`, HEX));
    const habitableEnd = normalize(habitableStart, (CANVAS_SIZE / 2), parseInt(`0x${_habitableEnd}`, HEX));
    const astroidsStart = normalize(sunSize, (CANVAS_SIZE / 2) , parseInt(`0x${_astroidsStart}`, HEX));
    const astroidsEnd = normalize(astroidsStart, (CANVAS_SIZE / 2), parseInt(`0x${_astroidsEnd}`, HEX));
    return { habitableStart, habitableEnd, astroidsStart, astroidsEnd, sunSize };
  }

  const normalize = (min, max, x) => {
    return Math.abs((max - min) * (x / MAX_INT));
  }

  const getPlanet = ({ tx }, sunSize) => {
    const noZeroHash = tx.substring(2);

    const [_color1, _color2, _color3, _theta, _distance, _speed, _radius] = noZeroHash.match(re);

    const theta = normalize(0, 1, parseInt(`0x${_theta}`, HEX));
    const distance = normalize(sunSize, CANVAS_SIZE / 2, parseInt(`0x${_distance}`, HEX)) + sunSize;
    const speed = normalize(1, 6, parseInt(`0x${_speed}`, HEX));
    const radius = normalize(5, sunSize - 2, parseInt(`0x${_radius}`, HEX));
    const tailLength = 90 * (radius / sunSize);

    return {
      color: {
        r: parseInt(`0x${_color1}`, HEX),
        g: parseInt(`0x${_color2}`, HEX),
        b: parseInt(`0x${_color3}`, HEX),
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

    const [_distance, _theta, _size] = noZeroHash.match(re);

    const theta = normalize(0, 1, parseInt(`0x${_theta}`, HEX));
    const distance = normalize(sun.size, sun.astroidsEnd, parseInt(`0x${_distance}`, HEX)) + sun.astroidsStart;
    const size = normalize(4, 10, parseInt(`0x${_size}`, HEX));

    return {
      // color: {
      //   r: parseInt(`0x${_color1}`, HEX),
      //   g: parseInt(`0x${_color2}`, HEX),
      //   b: parseInt(`0x${_color3}`, HEX),
      // },
      color: {
        r: 195,
        g: 160,
        b: 107,
      },
      theta,
      distance,
      size,
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