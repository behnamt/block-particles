import * as Tone from 'tone';
import { useEffect } from "react";

function Player({ tones }) {

  useEffect(() => {
    if (tones.length) {
      // const synths = [];
      // const loops = [];
      // tones.forEach(tone => {
      //   synths.push({
      //     instrument: new tone.instrument().toDestination(),
      //     note: tone.note,
      //     loop: tone.loop,
      //     duration: tone.duration
      //   })
      // })

      // synths.forEach(synth => {
      //   loops.push(new Tone.Loop(time => {
      //     synth.instrument.triggerAttackRelease(synth.note, synth.duration, time);
      //   }, synth.loop).start(0))
      // })
      // Tone.Transport.start()
      const synthA = new Tone.FMSynth().toDestination();
      const synthB = new Tone.AMSynth().toDestination();
      //play a note every quarter-note
      const loopA = new Tone.Loop(time => {
        synthA.triggerAttackRelease("C2", "8n", time);
      }, "4n").start(0);
      //play another note every off quarter-note, by starting it "8n"
      const loopB = new Tone.Loop(time => {
        synthB.triggerAttackRelease("C4", "8n", time);
      }, "4n").start("8n");
      // all loops start until the Transport is started
      Tone.Transport.start()
    }
  }, [tones])

  return (
    <div>player</div>
  )

}

export default Player;