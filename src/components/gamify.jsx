/*global setInterval clearInterval*/
import {Checkbox, FormControlLabel} from "@material-ui/core";
import PageVisibility from "react-page-visibility";
import React, {useState, useEffect} from "react";
import produce from "immer";

import ifvisible from "ifvisible.js";
import {
  addIntervalEvent,
  addOneTimeEvent,
  createEventWithInterval,
  createGameState,
  createOneTimeEvent,
  reduceGameState,
} from "./gamelogic";
import {getRandomNumberInclusive} from "./random-reward";

export function Game({gameState = createState(0)}) {
  const [state, setState] = useState(gameState);

  function dispatch(event) {
    setState((state) => reduceGameState(state, event));
  }
  function handleCheckboxSelect(event) {
    switch (event.target.name) {
      case "checkBox_toggleIsActive":
        const speedChange = event.target.checked ? 1 : -1;
        const newSpeed = state.speedMultiplier + speedChange;

        if (event.target.checkbox) {
          dispatch({
            type: "SET_PROGRESS_INCREMENT_SPEED",
            speedMultiplier: newSpeed,
          });
        } else {
          dispatch({
            type: "SET_PROGRESS_INCREMENT_SPEED",
            speedMultiplier: newSpeed,
          });
        }

        break;
      default:
    }
  }

  const setupTimeEffect = () => {
    const timer = setInterval(() => {
      dispatch({type: "HANDLE_TIME_TICK"});
    }, state.millisecondsPerTick);
    return () => {
      clearInterval(timer);
    };
  };
  useEffect(setupTimeEffect, []);

  return (
    <div>
      <PageVisibility
        onChange={(isVisible) => {
          dispatch({
            type: "SET_VARIABLE",
            property: "isVisible",
            value: isVisible,
          });
        }}
      ></PageVisibility>
      <button
        onClick={() => {
          dispatch({type: "TOGGLE_BOOLEAN", property: "isFocusModeEnabled"});
        }}
      >
        Start
      </button>
      <button
        onClick={() => {
          dispatch({
            type: "SET_PROGRESS_INCREMENT_SPEED",
            speedMultiplier: 2,
          });
        }}
      >
        In active position
      </button>
      <div>
        <FormControlLabel
          value="start"
          label="Sitting in an active position"
          name="checkBox_toggleIsActive"
          control={<Checkbox color="primary" onChange={handleCheckboxSelect} />}
        />
      </div>
      <ProgressView progressAmount={state.progressAmount} />
      <div>Speed: {state.speedMultiplier}</div>
      <div>{state.isFocusModeEnabled ? "focused" : null} </div>
      {state.isRandomRewardChecked ? (
        <div>Reward: {state.reward}</div>
      ) : (
        <>Loading...</>
      )}
    </div>
  );
}
function disable() {}

function createState() {
  let state = createGameState();
  state = addIntervalEvent(
    state,
    createEventWithInterval({
      id: "CHECK_IF_USER_HAS_LEFT_PAGE",
      intervalMilliseconds:
        state.defaultIncrementInterval / state.speedMultiplier,
      runEvent: (state) => {
        () => {
          thottle(() => console.log(ifvisible.now()), 1000);

          if (!ifvisible.now()) {
            // Display pop-up
            console.log("NOT VISIBLE", Date().toString());
          }
        };
        return state;
      },
    }),
  );

  state = addIntervalEvent(
    state,
    createEventWithInterval({
      id: "UPDATE_PROGRESS_ID",
      intervalMilliseconds:
        state.defaultIncrementInterval / state.speedMultiplier,
      runEvent: (state) => {
        if (state.isFocusModeEnabled) {
          return reduceGameState(state, {
            type: "SET_VARIABLE",
            property: "progressAmount",
            value: state.progressAmount + state.incrementAmount,
          });
        }
        return state;
      },
    }),
  );
  state = addOneTimeEvent(
    state,
    createOneTimeEvent({
      id: "SHOW_DELAYED_REWARD_ID",
      runTime: 1000,
      runEvent: (state) => {
        return produce(state, (draftState) => {
          let newState = reduceGameState(state, {
            type: "SET_VARIABLE",
            property: "isRandomRewardChecked",
            value: true,
          });

          const randomNumberBetween1and100 = getRandomNumberInclusive({
            min: 1,
            max: 100,
            seed: state.randomSeed,
          });

          const shouldGiveRandomReward = randomNumberBetween1and100 > 50;
          if (shouldGiveRandomReward) {
            newState = reduceGameState(newState, {
              type: "SET_VARIABLE",
              property: "progressAmount",
              value: state.progressAmount + 7,
            });
          }

          return newState;
        });
      },
    }),
  );
  return state;
}
export function ProgressView({progressAmount}) {
  return <div>progressAmount {progressAmount.toFixed(1)}%</div>;
}
