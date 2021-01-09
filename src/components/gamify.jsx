/*global setInterval clearInterval*/
import {Checkbox, FormControlLabel} from "@material-ui/core";
import PageVisibility from "react-page-visibility";
import React, {useState, useEffect} from "react";

import {addEvent, createEventWithInterval, reduceGameState} from "./gamelogic";

export function Game({startAmount = 0}) {
  const [state, setState] = useState(createState(startAmount));

  function dispatch(event) {
    setState((state) => reduceGameState(state, event));
  }
  function handleCheckboxSelect(event) {
    switch (event.target.name) {
      case "isActiveCheckBox":
        const speedChange = event.target.checked ? 1 : -1;
        const newSpeed = state.speedMultiplier + speedChange;
        dispatch({
          type: "SET_PROGRESS_INCREMENT_SPEED",
          speedMultiplier: newSpeed,
        });
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
  useEffect(() => {
    setTimeout(
      () =>
        dispatch({
          type: "SET_VARIABLE",
          property: "isRandomRewardChecked",
          value: true,
        }),
      3000,
    );
    return () => {};
  }, []);
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
        Get Focus
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
          name="isActiveCheckBox"
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
function createState() {
  let state = {
    reward: 0,
    isRandomRewardChecked: false,
    millisecondsPassed: 0,
    progressAmount: 88,
    millisecondsPerTick: 50,
    defaultIncrementInterval: 1000,
    incrementAmount: 0.1,
    speedMultiplier: 1,
    isVisible: true,
    timeIntervalEvents: [],
    oneTimeEvents: [],
  };
  state = addEvent(
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

  return state;
}
export function ProgressView({progressAmount}) {
  return <div>progressAmount {progressAmount.toFixed(1)}%</div>;
}
