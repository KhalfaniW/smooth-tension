import {Button} from "@material-ui/core";
import {useAudio} from "react-use";
import InputAdornment from "@material-ui/core/InputAdornment";
import React, {useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";

import {ProdcutivityTimer} from "components/timers";
import {Stack, ItemLine} from "components/react-layout";
import pianoAlarm from "resources/piano-alarm-clip.mp3";
import Sound from "react-sound";

export default function WorkBreakTimer({
  onBreakTimeFinish = () => {},
  onWorkTimeFinish = () => {},
}) {
  const [isAlarmEnabled, setIsAlarmEnabled] = useState(false);

  return (
    <>
      {isAlarmEnabled && (
        <TimerAlarm onAlarmCancel={() => setIsAlarmEnabled(false)} />
      )}
      <WorkBreakTimerWithoutAlarm
        onWorkTimeFinish={() => setIsAlarmEnabled(true)}
        onBreakTimeFinish={() => setIsAlarmEnabled(true)}
        onNewTimeSet={() => setIsAlarmEnabled(false)}
      />
    </>
  );
}

export function TimerAlarm({onAlarmCancel}) {
  // const [audio, state, controls, ref] = useAudio({
  //   src: pianoAlarm,
  //   autoPlay: true,
  // });
  //TODO loop and stop
  const [isAlarmDismissed, setIsAlarmDismissed] = useState(false);
  const [playing, setPlaying] = useState(true);
  return (
    <>
      {isAlarmDismissed ? null : (
        <>
          <Sound
            url={pianoAlarm}
            playStatus={Sound.status.PLAYING}
            playFromPosition={0}
            loop={!isAlarmDismissed}
          />
        </>
      )}
      <button
        onClick={() => {
          setIsAlarmDismissed(true);
          onAlarmCancel();
        }}
      >
        Stop
      </button>
    </>
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
        <Stack spacing={3} width="50%">
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
        <Stack spacing={3}>
          <TextField
            label="Minutes for Work"
            type="number"
            onChange={(event) => {
              setWorkTimerMinutes(event.target.value);
              onNewTimeSet();
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">m</InputAdornment>,
            }}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            value={workTimerMinutes}
          />
          <TextField
            label="Minutes for Break"
            type="number"
            onChange={(event) => {
              setBreakTimerMinutes(event.target.value);
              onNewTimeSet();
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">m</InputAdornment>,
            }}
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            value={breakTimerMinutes}
          />
        </Stack>
      </Stack>
    </>
  );
}
