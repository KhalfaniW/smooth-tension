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

import {settings} from "./game-settings";

import {getRandomIntInclusive} from "./random-reducer";

export function Game({state = createState(), seed = 420}) {
  const [gameState, setState] = useState({...state, seed: seed});

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
  const allComputedProperties = getComputedProperties(gameState);
  const {totalPoints, pointsRemaining} = allComputedProperties;

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
          actionList={getUserStateActions(settings)}
          onSelect={(itemSelected) => {
            const speedChange = getUserStateActionsValue(settings)[
              itemSelected
            ];
            dispatch({
              type: "SET_PROGRESS_INCREMENT_SPEED",
              speedMultiplier: gameState.speedMultiplier + speedChange,
            });
          }}
          onDeselect={(itemSelected) => {
            const speedChange = getUserStateActionsValue(settings)[
              itemSelected
            ];
            dispatch({
              type: "SET_PROGRESS_INCREMENT_SPEED",
              speedMultiplier: gameState.speedMultiplier - speedChange,
            });
          }}
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
      <PointsShop
        {...{
          ...gameState,
          ...allComputedProperties,
          onSpendAPoint: () => {
            spendAPoint({dispatch: dispatch, gameState: gameState});
          },
        }}
      />
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
export function UserStateActions({onSelect, onDeselect, actionList}) {
  function handleCheckboxSelect(event) {
    if (event.target.checked) {
      onSelect(event.target.name);
    } else {
      onDeselect(event.target.name);
    }
  }

  return (
    <div>
      {getUserStateActions(settings).map((physicalStateForUserToBeIn) => (
        <FormControlLabel
          key={physicalStateForUserToBeIn}
          value="start"
          label={physicalStateForUserToBeIn}
          name={physicalStateForUserToBeIn}
          control={<Checkbox color="primary" onChange={handleCheckboxSelect} />}
        />
      ))}
    </div>
  );
}
function getUserStateActions(settings) {
  return Object.keys(settings.userActionsValueDictionary.physicalState);
}
function getUserStateActionsValue({settings, itemName}) {
  return settings.userActionsValueDictionary.physicalState[itemName];
}

export function ProgressView({progressAmount}) {
  return <div>Progress {progressAmount.toFixed(1)}%</div>;
}

export function PointsShop({
  onSpendAPoint,
  totalPoints,
  pointsRemaining,
  lastReward,
  totalReward,
  isWaitingForReward,
}) {
  return (
    <div>
      <div>
        {isWaitingForReward
          ? `Calculating progress Addendum`
          : ` last reward ${lastReward}
           Total ${totalReward} `}
      </div>
      <button
        disabled={pointsRemaining === 0 || isWaitingForReward}
        onClick={() => {
          //--1 point
          // begin show point
          //update seed
          //end show point
          onSpendAPoint();
        }}
      >
        Use Point
      </button>
    </div>
  );
}

function getPreviousPropertyValue({state, property}) {
  const previous = state["previous_" + property];
  if (typeof previous === "undefined") {
    return state[property];
  }
  return previous;
}
function getComputedProperties(gameState) {
  //minimize properties in gameState for simplicity
  const percentOverMax = Math.max(gameState.progressAmount - 100, 0);
  const totalPoints = Math.floor(percentOverMax / 20);
  const pointsRemaining = totalPoints - gameState.pointsUsed;

  const previousTotalReward = getPreviousPropertyValue({
    state: gameState,
    property: "totalReward",
  });

  const isWaitingForReward = getIsEventPending({
    state: gameState,
    id: "WAIT_TO_SHOW_REWARD_ID",
  });

  if (pointsRemaining < 0) {
    throw new Error("Used more points then available");
  }
  return {
    totalPoints,
    pointsRemaining,
    isWaitingForReward,
    previousTotalReward,
    lastReward: gameState.totalReward - previousTotalReward,
  };
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
  console.log({seed: gameState.seed, reward: gameState.totalReward});

  const rewardAddition =
    getRandomIntInclusive({min: 1, max: 100, seed: gameState.seed}) < 20
      ? 1
      : 0;
  dispatch({
    type: "SET_CURRENT_AND_PREVIOUS_VARIABLE",
    property: "totalReward",
    value: gameState.totalReward + rewardAddition,
  });
}
function doNothing(gameState) {
  return gameState;
}
function createState() {
  let gameState = {
    ...createGameState(),
    progressAmount: 300,
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
