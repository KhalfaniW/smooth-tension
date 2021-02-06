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
const tabs = Object.freeze({
  LANDING: "landing",
  START_INSTRUCTIONS: "start_instructions",
  GAME: "game",
  LEARN_MORE: "learn_more",
});
export default function Main() {
  let pageToShow;
  const [n, setPage] = useState(0);
  const START_PAGE = 1;
  const MAIN_PAGE = 2;
  const LEARN_MORE_PAGE = 3;

  const currentTab = Object.values(tabs)[n];
  switch (currentTab) {
    case tabs.LANDING:
      pageToShow = (
        <>
          <LandingPage
            callToActionComponent={
              <div className="pb-14 w-full flex flex-col justify-center">
                <button
                  onClick={() => {
                    setPage(START_PAGE);
                  }}
                >
                  Begin
                </button>
                <button
                  onClick={() => {
                    setPage(MAIN_PAGE);
                  }}
                >
                  Quick Start
                </button>
                <button
                  onClick={() => {
                    setPage(LEARN_MORE_PAGE);
                  }}
                >
                  Learn More
                </button>
              </div>
            }
          />
        </>
      );
      break;
    case tabs.START_INSTRUCTIONS:
      pageToShow = (
        <>
          <StartPage onNextPageClick={() => setPage(MAIN_PAGE)} />
        </>
      );
      break;
    case tabs.GAME:
      pageToShow = (
        <Stack width="100%">
          <Game />
        </Stack>
      );
      break;
    default:
      pageToShow = "ERROR";
  }
  return (
    <>
      {pageToShow}

      <button onClick={() => setPage((n) => (n + 1) % 4)}> Switch </button>
    </>
  );
}
function LandingPage({callToActionComponent}) {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex justify-center sm:py-12">
      <div className="flex flex-col items-center justify-between ">
        <div className="display-flex h-1/4  w-5/6 flex flex-col items-start justify-between">
          <p className="pb-5 self-center">Welcome to Smooth Tension</p>
          <p>Master discomfort</p>
          <p>Live your values</p>
          <p>Replace addictive software with strength and mindfulness</p>
        </div>

        {callToActionComponent}
      </div>
    </div>
  );
}

function StartPage({onNextPageClick}) {
  const NON_BOLD_HEADING = "mb-3  text-xl font-normal leading-tight lg:text-xl";
  const BASIC_BLUE_BUTTON =
    "py-2 px-4 capitalize tracking-wide bg-blue-600 dark:bg-gray-800 text-white font-medium rounded hover:bg-blue-500 dark:hover:bg-gray-700 focus:outline-none focus:bg-blue-500 dark:focus:bg-gray-700";
  return (
    <div className="w-full ">
      <h4 className="mb-3 font-serif text-2xl font-normal leading-tight lg:text-3xl">
        Start by creating tension
      </h4>
      <div className="max-w-2xl mx-auto px-8 py-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <ul className="">
          <h3 className={NON_BOLD_HEADING}>
            Ideas to create tension in your body:
          </h3>

          <li>Head</li>
          <ul className="pb-2 pl-3 ">
            <li>Furrow your eyebrows</li>
            <li>Tense your tounge</li>
          </ul>
          <li>
            Arms
            <ul className="pb-2 pl-3 ">
              <li>Clench your fists</li>
              <li>Tense your biceps</li>
            </ul>
          </li>
          <li>
            Torso
            <ul className="pb-2 pl-3 ">
              <li>Tighten your abdomen</li>
              <li>Flex your back muscles</li>
            </ul>
          </li>
        </ul>

        <button
          onClick={() => {
            onNextPageClick();
          }}
          className={BASIC_BLUE_BUTTON}
        >
          {" "}
          Begin
        </button>
      </div>
    </div>
  );
}
