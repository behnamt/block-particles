import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import Player from '../components/Player';
import * as Tone from 'tone';
import { DuoSynth, FMSynth } from 'tone';

const InputWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
const StyledInput = styled.input`
  margin-top: 20px;
  font-size: 30px;
  height: 70px;
  width: 200px;
`;

const HASH_SPLITTER = 1;
const re = new RegExp(`.{1,${HASH_SPLITTER}}`, 'g');

// const instrumentMap = {
//   0: Tone.AMSynth,
//   1: Tone.DuoSynth,
//   2: Tone.FMSynth,
//   3: Tone.MembraneSynth,
//   4: Tone.MetalSynth,
//   5: Tone.NoiseSynth,
//   6: Tone.PluckSynth,
// }
const instrumentMap = {
  0: Tone.FMSynth,
  1: Tone.FMSynth,
  2: Tone.FMSynth,
  3: Tone.FMSynth,
  4: Tone.FMSynth,
  5: Tone.FMSynth,
  6: Tone.FMSynth,
}

const SubMap = {
  0: "1n",
  1: "1n.",
  2: "2n",
  3: "2n.",
  5: "2t",
  6: "4n",
  7: "4n.",
  8: "4t",
  9: "8n",
  10: "8n.",
  11: "8t",
  12: "16n",
  13: "16n.",
  14: "16t",
  15: "32n",
}

const NoteMap = {
  0: "C-4",
  1: "D-4",
  2: "E-4",
  3: "F-4",
  5: "G-4",
  6: "A-4",
  7: "B-4",
  8: "C-3",
  9: "D-3",
  10: "E-3",
  11: "F-3",
  12: "G-3",
  13: "A-3",
  14: "B-3",
  15: "C-2",
}

function PlayerPage() {
  let { block } = useParams();
  const { account, library: web3 } = useWeb3React();
  const [blockNumber, setBlockNumber] = useState(block || 'latest');
  const [transactions, setTransactions] = useState([]);
  const [notes, setNotes] = useState([]);

  const getNotes = (tx) => {
    const noZeroHash = tx.substring(2);

    const [_instrument, _loop, _note, _duration,] = noZeroHash.match(re);
    const instrument = instrumentMap[Math.round(6 * (parseInt(`0x${_instrument}`, 16) / 15))];
    const loop = SubMap[parseInt(`0x${_loop}`, 16)];
    const duration = SubMap[parseInt(`0x${_duration}`, 16)];
    const note = NoteMap[parseInt(`0x${_note}`, 16)];
    return { instrument, loop, duration, note }
  }

  useEffect(() => {

    (async () => {
      if (web3 && account) {
        const { transactions } = await web3.eth.getBlock(blockNumber);
        setTransactions(transactions);
      }
    })();

  }, [web3, account, blockNumber]);

  useEffect(() => {
    if (transactions.length){
      setNotes(transactions.slice(0,2).map(tx=>getNotes(tx)));
    }
  }, [transactions])

  const handleKeyPress = ({ code, target }) => {
    if (code === 'Enter') {
      if (!isNaN(parseInt(target.value))) {
        setBlockNumber(target.value);
      } else {
        setBlockNumber('latest');
      }
    }
  }

  return (
    notes.length && (
      <React.Fragment>
        <Player tones={notes} />
        <InputWrapper>
          <StyledInput onKeyPress={handleKeyPress} defaultValue={blockNumber} placeholder="block number" title="press enter to apply" />
        </InputWrapper>
      </React.Fragment>
    )
  );
}

export default PlayerPage;