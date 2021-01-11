import {Checkbox, FormControlLabel} from "@material-ui/core";
import PageVisibility from "react-page-visibility";
import React, {useState, useEffect} from "react";
import produce from "immer";
import styled from "styled-components";

import {
  addIntervalEvent,
  addOneTimeEvent,
  createIntervalEvent,
  createOneTimeEvent,
} from "./time-reducer";
import {createGameState, reduceGameState} from "./game-reducer";
import {getRandomIntInclusive} from "./random-reducer";

export function Game({gameState = createState(), seed = Date.now()}) {
  const [state, setState] = useState({...gameState, seed: 5});

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
  const totalPoints = 4;
  return (
    <GameWrapper
      onMouseEnter={() => {
        dispatch({
          type: "SET_VARIABLE",
          property: "isVisible",
          value: true,
        });
      }}
      onMouseLeave={() => {
        dispatch({
          type: "SET_VARIABLE",
          property: "isVisible",
          value: false,
        });
      }}
    >
      Keep Mouse in area
      <PageVisibility
        onChange={(isVisible) => {
          /* dispatch({ */
          /*   type: "SET_VARIABLE", */
          /*   property: "isVisible", */
          /*   value: isVisible, */
          /* }); */
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
      <div>
        {state.isVisible.toString()}Speed: {state.speedMultiplier}
      </div>
      <div>{state.isFocusModeEnabled ? "focused" : null} </div>
      {state.isRandomRewardChecked ? (
        <div>Reward: {state.initialReward}</div>
      ) : (
        <>Calculating...</>
      )}
      <div>
        {totalPoints > 0
          ? `Points ${state.pointsRemaining}/${totalPoints}`
          : null}{" "}
      </div>
      <button
        onClick={() => {
          dispatch({
            type: "SET_VARIABLE",
            property: "pointsRemaining",
            value: state.pointsRemaining - 1,
          });
        }}
      >
        Use Point
      </button>
    </GameWrapper>
  );
}
const GameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 50px;
  color: #444;
  border: 1px solid #1890ff;
`;

function createState() {
  let state = createGameState();

  state = reduceGameState(state, {
    type: "ADD_INTERVAL_EVENT",
    intervalEvent: createIntervalEvent({
      id: "UPDATE_PROGRESS_ID",
      intervalMilliseconds:
        state.defaultIncrementInterval / state.speedMultiplier,
      runEvent: (state) => {
        if (state.isFocusModeEnabled && state.isVisible) {
          return reduceGameState(state, {
            type: "SET_VARIABLE",
            property: "progressAmount",
            value: state.progressAmount + state.incrementAmount,
          });
        }
        return state;
      },
    }),
  });
  state = reduceGameState(state, {
    type: "ADD_ONE_TIME_EVENT",
    oneTimeEvent: createOneTimeEvent({
      id: "SHOW_DELAYED_REWARD_ID",
      runTime: 1000,
      runEvent: (state) => {
        return produce(state, (draftState) => {
          let newState = reduceGameState(state, {
            type: "SET_VARIABLE",
            property: "isRandomRewardChecked",
            value: true,
          });

          const randomNumberBetween1and100 = getRandomIntInclusive({
            min: 1,
            max: 100,
            seed: state.randomSeed,
          });

          const shouldGiveRandomReward = randomNumberBetween1and100 > 50;
          if (shouldGiveRandomReward) {
            newState = reduceGameState(newState, {
              type: "SET_VARIABLE",
              property: "initialReward",
              value: 7,
            });
          }

          return newState;
        });
      },
    }),
  });
  return state;
}
export function ProgressView({progressAmount}) {
  return <div>progressAmount {progressAmount.toFixed(1)}%</div>;
}
