import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import {useMap} from "react-use";
import React, {useEffect, useState} from "react";
import lodash, {uniq} from "lodash";

import {MeditationTimer} from "components/timers";
import {Stack} from "components/react-layout";
import CalmPlaylist from "components/calm-playlist";
import WorkBreakTimer from "components/work-break-timer";

import produce from "immer";
import {InternalValuesPage} from "./value-chart";
import {RandomRewardCreator} from "./random-reward";
import {Game} from "components/game/gamify";
// import MeditationTimerGroup from "pages/meditation-timer-group";

export default function Main() {
  return (
    <>
      <Stack width="100%">
        <Game />
      </Stack>
    </>
  );
}
