import {Checkbox, FormControlLabel} from "@material-ui/core";
import React, {useState, useEffect} from "react";
import produce from "immer";
import styled from "styled-components";

import {createGameState, reduceGameState} from "./game-reducer";
import {
  createIntervalEvent,
  createOneTimeEvent,
  getIsEventPending,
} from "./time-reducer";
import {getRandomIntInclusive} from "./random-reducer";
import {userActionsValueDictionary} from "./game-config";

export function Game({state = createState(), seed = Date.now()}) {
  const [gameState, setState] = useState({...state, seed: 5});

  function dispatch(event) {
    setState((gameState) => reduceGameState(gameState, event));
  }
  const setupTimeEffect = () => {
    const timer = setInterval(() => {
      dispatch({type: "HANDLE_TIME_TICK"});
    }, gameState.millisecondsPerTick);
    return () => {
      clearInterval(timer);
    };
  };
  useEffect(setupTimeEffect, []);

  const {
    totalPoints,
    pointsRemaining,
    isWaitingForReward,
    previousReward,
  } = getComputedProperties(gameState);

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
      Keep Mouse in this area
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
        <UserStateActions
          dispatch={dispatch}
          gameState={gameState}
        ></UserStateActions>
      </div>
      <ProgressView progressAmount={gameState.progressAmount} />
      <div>{gameState.isVisible ? "" : "Paused"}</div>
      <div>Speed: {gameState.speedMultiplier}</div>
      <div>{gameState.isFocusModeEnabled ? "focused" : null} </div>
      {gameState.isRandomRewardChecked ? (
        <div>Reward: {gameState.initialReward}</div>
      ) : (
        <>Calculating...</>
      )}
      <div>
        {totalPoints > 0 ? `Points ${pointsRemaining}/${totalPoints}` : null}{" "}
      </div>
      <div>
        {isWaitingForReward
          ? `Calculating progress Addendum`
          : `Total ${
              gameState.reward
            } ${previousReward} most recent ${gameState.reward -
              previousReward}`}
      </div>
      <button
        disabled={pointsRemaining === 0 || isWaitingForReward}
        onClick={() => {
          //--1 point
          // begin show point
          //update seed
          //end show point
          spendAPoint({dispatch: dispatch, gameState: gameState});
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
export function UserStateActions({dispatch, gameState}) {
  function handleCheckboxSelect(event) {
    const speedValue =
      userActionsValueDictionary.physicalState[event.target.name];

    const speedChange = event.target.checked ? speedValue : -speedValue;
    const newSpeed = gameState.speedMultiplier + speedChange;
    dispatch({
      type: "SET_PROGRESS_INCREMENT_SPEED",
      speedMultiplier: newSpeed,
    });
  }

  return (
    <div>
      {Object.keys(userActionsValueDictionary.physicalState).map(
        (physicalStateForUserToBeIn) => (
          <FormControlLabel
            key={physicalStateForUserToBeIn}
            value="start"
            label={physicalStateForUserToBeIn}
            name={physicalStateForUserToBeIn}
            control={
              <Checkbox color="primary" onChange={handleCheckboxSelect} />
            }
          />
        ),
      )}
    </div>
  );
}

export function ProgressView({progressAmount}) {
  return <div>Progress {progressAmount.toFixed(1)}%</div>;
}

function getComputedProperties(gameState) {
  //minimize properties in gameState for simplicity
  const percentOverMax = Math.max(gameState.progressAmount - 100, 0);
  const totalPoints = Math.floor(percentOverMax / 20);
  const pointsRemaining = totalPoints - gameState.pointsUsed;

  const previousReward = gameState.previous_reward
    ? gameState.previous_reward
    : 0;

  const isWaitingForReward = getIsEventPending({
    state: gameState,
    id: "WAIT_TO_SHOW_REWARD_ID",
  });
  if (pointsRemaining < 0) {
    throw new Error("Used more points then available");
  }
  return {totalPoints, pointsRemaining, isWaitingForReward, previousReward};
}
function spendAPoint({gameState, dispatch}) {
  dispatch({
    type: "ADD_ONE_TIME_EVENT",
    oneTimeEvent: createOneTimeEvent({
      id: "WAIT_TO_SHOW_REWARD_ID",
      runTime: gameState.millisecondsPassed + 1000,
      runEvent: (gameState) => {
        return produce(gameState, (draftState) => doNothing(gameState));
      },
    }),
  });
  dispatch({
    type: "SET_VARIABLE",
    property: "pointsUsed",
    value: gameState.pointsUsed + 1,
  });

  dispatch({
    type: "UPDATE_SEED",
  });

  dispatch({
    type: "SET_CURRENT_AND_PREVIOUS_VARIABLE",
    property: "reward",
    value:
      gameState.reward +
      getRandomIntInclusive({min: 0, max: 5, seed: gameState.seed}),
  });
}
function doNothing(gameState) {
  return gameState;
}
function createState() {
  let gameState = {
    ...createGameState(),
    progressAmount: 120,
  };

  gameState = reduceGameState(gameState, {
    type: "ADD_INTERVAL_EVENT",
    intervalEvent: createIntervalEvent({
      id: "UPDATE_PROGRESS_ID",
      intervalMilliseconds:
        gameState.defaultIncrementInterval / gameState.speedMultiplier,
      runEvent: (gameState) => {
        if (gameState.isFocusModeEnabled && gameState.isVisible) {
          return reduceGameState(gameState, {
            type: "SET_VARIABLE",
            property: "progressAmount",
            value: gameState.progressAmount + gameState.incrementAmount,
          });
        }
        return gameState;
      },
    }),
  });
  gameState = reduceGameState(gameState, {
    type: "ADD_ONE_TIME_EVENT",
    oneTimeEvent: createOneTimeEvent({
      id: "SHOW_DELAYED_REWARD_ID",
      runTime: 1000,
      runEvent: (gameState) => {
        return produce(gameState, (draftState) => {
          let newState = reduceGameState(gameState, {
            type: "SET_VARIABLE",
            property: "isRandomRewardChecked",
            value: true,
          });

          const randomNumberBetween1and100 = getRandomIntInclusive({
            min: 1,
            max: 100,
            seed: gameState.randomSeed,
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
  return gameState;
}
