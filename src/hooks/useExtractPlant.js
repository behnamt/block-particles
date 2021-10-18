const useExtractPlant = ({ CANVAS_SIZE, HASH_SPLITTER, }) => {

  const HEX = 16;
  const MAX_INT = HASH_SPLITTER ** 8;
  const re = new RegExp(`.{1,${HASH_SPLITTER}}`, 'g');

  const normalize = (min, max, x) => {
    return (max - min) * (x / MAX_INT)
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
      color: `#${_color1}${_color2}${_color3}`,
      theta,
      distance,
      speed,
      radius,
      tailLength
    };
  }

  return {
    getPlanet,
    normalize,
  }
}

export default useExtractPlant;