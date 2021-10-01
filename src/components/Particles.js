import { useEffect } from 'react';
import anime from 'animejs/lib/anime.es.js';
import styled from 'styled-components';

const CANVAS_SIZE = 500; // in px
const MAX_PARTICLE_SIZE = 50; // in px

const HASH_SPLITTER = 2;
const MAX_INT = HASH_SPLITTER ** 8;
const HEX = 16;

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

  useEffect(() => {
    if (hashes.length) {
      const animatedHashes = hashes.map(tx => {
        const noZeroHash = tx.substring(2);
        const [_color1, _color2, _color3, _fromX, _toX, _fromY, _toY, _fromSize, _toSize, _rotate, _fromBorder, _toBorder, _duration, _delay] = noZeroHash.match(re);

        const fromX = parseInt(`0x${_fromX}`, HEX) / MAX_INT * CANVAS_SIZE;
        const toX = parseInt(`0x${_toX}`, HEX) / MAX_INT * CANVAS_SIZE;
        const fromY = parseInt(`0x${_fromY}`, HEX) / MAX_INT * CANVAS_SIZE;
        const toY = parseInt(`0x${_toY}`, HEX) / MAX_INT * CANVAS_SIZE;
        const fromSize = parseInt(`0x${_fromSize}`, HEX) / MAX_INT * MAX_PARTICLE_SIZE;
        const toSize = parseInt(`0x${_toSize}`, HEX) / MAX_INT * MAX_PARTICLE_SIZE;
        const rotate = parseInt(`0x${_rotate}`, HEX) / MAX_INT * 360;
        const fromBorder = parseInt(`0x${_fromBorder}`, HEX) / MAX_INT * 100;
        const toBorder = parseInt(`0x${_toBorder}`, HEX) / MAX_INT * 100;
        const duration = parseInt(`0x${_duration}`, HEX) * 100;
        const delay = parseInt(`0x${_delay}`, HEX) * 10;
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