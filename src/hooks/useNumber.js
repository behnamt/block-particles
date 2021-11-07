import { HASH_SPLITTER } from "../constants/numbers";

const useNumber = () => {
    const hexToInt = (value) => parseInt(`0x${value}`, 16)

    const MAX_INT = HASH_SPLITTER ** 8

  const normalize = (min, max, x, maxInt = MAX_INT) => {
    return Math.abs((max - min) * (x / maxInt)) + min;
  }

    return {
        hexToInt,
        normalize,
        MAX_INT,
    }
    
}

export default useNumber;