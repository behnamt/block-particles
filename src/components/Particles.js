import { useEffect } from 'react';
import anime from 'animejs/lib/anime.es.js';
import styled from 'styled-components';
import useNumber from '../hooks/useNumber';
import { CANVAS_SIZE, HASH_SPLITTER, MAX_PARTICLE_SIZE } from '../constants/numbers';



const re = new RegExp(`.{1,${HASH_SPLITTER}}`, 'g');

const WrapperDiv = styled.div`
    width: ${CANVAS_SIZE + 20}px;
    height: ${CANVAS_SIZE + 20}px;
    box-shadow: #525252 6px 6px;
    cursor: pointer;
    background: #969696;
    margin: 0 auto;
`;

const StyledDiv = styled.div`
  position: absolute;
`;

function Particles({ hashes }) {
  const {hexToInt, MAX_INT} = useNumber();

  useEffect(() => {
    if (hashes.length) {
      const animatedHashes = hashes.map(tx => {
        const noZeroHash = tx.substring(2);
        const [_color1, _color2, _color3, _fromX, _toX, _fromY, _toY, _fromSize, _toSize, _rotate, _fromBorder, _toBorder, _duration, _delay] = noZeroHash.match(re);

        const fromX = hexToInt(_fromX) / MAX_INT * CANVAS_SIZE;
        const toX = hexToInt(_toX) / MAX_INT * CANVAS_SIZE;
        const fromY = hexToInt(_fromY) / MAX_INT * CANVAS_SIZE;
        const toY = hexToInt(_toY) / MAX_INT * CANVAS_SIZE;
        const fromSize = hexToInt(_fromSize) / MAX_INT * MAX_PARTICLE_SIZE;
        const toSize = hexToInt(_toSize) / MAX_INT * MAX_PARTICLE_SIZE;
        const rotate = hexToInt(_rotate) / MAX_INT * 360;
        const fromBorder = hexToInt(_fromBorder) / MAX_INT * 100;
        const toBorder = hexToInt(_toBorder) / MAX_INT * 100;
        const duration = hexToInt(_duration) * 100;
        const delay = hexToInt(_delay) * 10;
        return {
          backgroundColor: `#${_color1}${_color2}${_color3}`,
          translateX: [fromX, toX],
          translateY: [fromY, toY],
          width: [fromSize, toSize],
          height: [fromSize, toSize],
          rotate,
          borderRadius: [`${fromBorder}%`, `${toBorder}%`],
          duration,
          delay,
        };
      });



      anime({
        targets: '.particle',
        backgroundColor: (el, i) => animatedHashes[i].backgroundColor,
        translateX: (el, i) => animatedHashes[i].translateX,
        translateY: (el, i) => animatedHashes[i].translateY,
        width: (el, i) => animatedHashes[i].width,
        height: (el, i) => animatedHashes[i].height,
        rotate: (el, i) => animatedHashes[i].rotate,
        borderRadius: (el, i) => animatedHashes[i].borderRadius,
        duration: (el, i) => animatedHashes[i].duration,
        delay: (el, i) => animatedHashes[i].delay
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hashes]);


  return (
    <WrapperDiv>
      {
        hashes.map((tx, i) => (
          <StyledDiv className="particle" key={tx}></StyledDiv>
        ))
      }
    </WrapperDiv>
  )
}

export default Particles;