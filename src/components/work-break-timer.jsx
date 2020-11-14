import { Button } from '@material-ui/core';
import {useAudio} from "react-use";
import InputAdornment from "@material-ui/core/InputAdornment";
import React, { useEffect, useState } from 'react';
import TextField from "@material-ui/core/TextField";

import {ProdcutivityTimer} from "components/timers";
import {Stack, ItemLine} from "components/react-layout";
import pianoAlarm from "resources/piano-alarm-clip.mp3";

export default function WorkBreakTimer({
  onBreakTimeFinish = () => {},
  onWorkTimeFinish = () => {},
}) {
  const [isAlarmEnabled, setIsAlarmEnabled] = useState(false);

  return (
    <>
      {isAlarmEnabled && <TimerAlarm />}
      <WorkBreakTimerWithoutAlarm
        onWorkTimeFinish={() => setIsAlarmEnabled(true)}
        onBreakTimeFinish={() => setIsAlarmEnabled(true)}
        onNewTimeSet={() => setIsAlarmEnabled(false)}
      />
    </>
  );
}

export function TimerAlarm({onAlarmCancel}) {
  const [audio, state, controls, ref] = useAudio({
    src: pianoAlarm,
    // autoPlay: true,
  });
  //TODO loop and stop
  const [isAlarmDismissed, setIsAlarmDismissed] = useState(false);
  useEffect(() => {
    controls.play();
  }, []);
  const isSoundAtEnd = state.time === state.duration;
  //TODO loop
  return (
    <div>
      {audio}
      isSoundAtEnd = {isSoundAtEnd}
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <button onClick={controls.pause}>Pause </button>
      <button onClick={controls.play}>Play</button>
      <button onClick={() => controls.volume(0.1)}>Volume: 10%</button>
      <button onClick={() => controls.volume(0.5)}>Volume: 50%</button>
      <button onClick={() => controls.volume(1)}>Volume: 100%</button>
      <br />
      <button onClick={() => controls.seek(state.time - 5)}>-5 sec</button>
      <button onClick={() => controls.seek(0)}>reset</button>
    </div>
  );
}

export function WorkBreakTimerWithoutAlarm({
  onBreakTimeFinish = () => {},
  onWorkTimeFinish = () => {},
  onNewTimeSet = () => {},
}) {
  const [workTimerMinutes, setWorkTimerMinutes] = useState(0);
  const [breakTimerMinutes, setBreakTimerMinutes] = useState(0);

  return (
    <>
      <Stack width="50%">
        Time Presets
        <Stack width="50%">
          Work
          <ProdcutivityTimer
            onComplete={onWorkTimeFinish}
            seconds={workTimerMinutes * 60}
          />
          Break
          <ProdcutivityTimer
            onComplete={onBreakTimeFinish}
            seconds={breakTimerMinutes * 60}
          />
        </Stack>
        <ItemLine>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setWorkTimerMinutes(45);
              setBreakTimerMinutes(15);
              onNewTimeSet();
            }}
          >
            High Value
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setWorkTimerMinutes(20);
              setBreakTimerMinutes(7);
              onNewTimeSet();
            }}
          >
            Normal
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setWorkTimerMinutes(2);
              setBreakTimerMinutes(5);
              onNewTimeSet();
            }}
          >
            Starter
          </Button>
        </ItemLine>
        <h2>Set Timers</h2>
        <TextField
          label="Minutes for Work"
          type="number"
          onChange={(event) => {
            setWorkTimerMinutes(event.target.value);
            onNewTimeSet();
          }}
          endAdorent={<InputAdornment position="end">m</InputAdornment>}
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          value={workTimerMinutes}
        />{" "}
        <TextField
          label="Minutes for Break"
          type="number"
          onChange={(event) => {
            setBreakTimerMinutes(event.target.value);
            onNewTimeSet();
          }}
          endAdorent={<InputAdornment position="end">m</InputAdornment>}
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          value={breakTimerMinutes}
        />
      </Stack>
    </>
  );
}
