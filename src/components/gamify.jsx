import {Checkbox, FormControlLabel, TextField} from "@material-ui/core";
import React, {useState, useEffect} from "react";
import produce from "immer";
import styled from "styled-components";
import PageVisibility from "react-page-visibility";
import {usePageVisibility} from "react-page-visibility";

import {createGameState, reduceGameState} from "./game-reducer";
import {
  createIntervalEvent,
  createOneTimeEvent,
  getIsEventPending,
} from "./time-reducer";
import {getRandomIntInclusive} from "./random-reducer";
import {settings, resistingSettings} from "./game-settings";

export function Game({state = createState(), seed = Date.now()}) {
  const [gameState, setState] = useState({
    ...state,
    seed: seed,

    timeSinceEpochMS: Date.now(),
  });

  function dispatch(event) {
    setState((gameState) => reduceGameState(gameState, event));
  }
  const setupTimeEffect = () => {
    const timer = setInterval(() => {
      dispatch({
        type: "HANDLE_UNRELIABLE_TIME_TICK",
        timeSinceEpochMS: Date.now(),
      });
    }, gameState.millisecondsPerTick);

    return () => {
      clearInterval(timer);
    };
  };
  useEffect(setupTimeEffect, [gameState.millisecondsPerTick]);
  const allComputedProperties = getComputedProperties(gameState);
  const {totalPoints, pointsRemaining} = allComputedProperties;

  return (
    <GameWrapper
      onMouseEnter={() => {
        dispatch(unpauseGame());
      }}
      onMouseLeave={() => {
        dispatch(pauseGame());
      }}
    >
      Keep Mouse in this area
      <PageVisibility
        onChange={(isVisible) => {
          const pauseOrUnpauseGame = isVisible ? unpauseGame() : pauseGame();
          dispatch(pauseOrUnpauseGame);
        }}
      ></PageVisibility>
      <button
        onClick={() => {
          dispatch({
            type: "SET_VARIABLE",
            property: "isFocusModeEnabled",
            value: true,
          });
        }}
      >
        Start
      </button>
      <button
        onClick={() => {
          dispatch({
            type: "SET_OBJECT",
            property: "currentSettings",
            value: resistingSettings,
          });
        }}
      >
        Tempted
      </button>
      <div>Note how feel</div>
      <TextField id="outlined-basic" label="Outlined" variant="outlined" />
      <ProgressView progressAmount={gameState.progressAmount} />
      <div>{gameState.isVisible ? "" : "Paused"}</div>
      <div>Speed: {gameState.speedMultiplier}</div>
      <div>{gameState.isFocusModeEnabled ? "focused" : null} </div>
      <div>
        <UserStateActions
          actionList={getUserStateActions(gameState)}
          onSelect={(itemSelected) => {
            const speedChange = getUserStateActionValue({
              state: gameState,
              itemName: itemSelected,
            });
            dispatch({
              type: "SET_PROGRESS_INCREMENT_SPEED",
              speedMultiplier: gameState.speedMultiplier + speedChange,
            });
          }}
          onDeselect={(itemSelected) => {
            const speedChange = getUserStateActionValue({
              state: gameState,
              itemName: itemSelected,
            });
            dispatch({
              type: "SET_PROGRESS_INCREMENT_SPEED",
              speedMultiplier: gameState.speedMultiplier - speedChange,
            });
          }}
        ></UserStateActions>
        Block
        <UserOneTimeActions
          actionList={getUserOneTimeActions(gameState)}
          onComplete={(itemSelected) => {
            const userActionValue = getUserOneTimeActionValue({
              state: gameState,
              itemName: itemSelected,
            });

            dispatch(
              setUserPointsAction(gameState.userActionPoints + userActionValue),
            );
          }}
        />
      </div>
      {gameState.isRandomRewardChecked ? (
        <div>Reward: {gameState.userActionPoints}</div>
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
      {actionList.map((physicalStateForUserToBeIn) => (
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
export function UserOneTimeActions({onComplete, actionList}) {
  const originalDictionary = actionList.reduce(function(dictionary, item) {
    dictionary[item] = false;
    return dictionary;
  }, {});

  const [isCompletedDictionary, setDictionary] = useState({
    ...originalDictionary,
  });
  function handleCheckboxSelect(event) {
    const item = event.target.name;
    const hasItemNotBeenCompleted = isCompletedDictionary[item] === false;

    if (event.target.checked && hasItemNotBeenCompleted) {
      onComplete(item);
      setDictionary((isCompletedDictionary) => {
        return {...isCompletedDictionary, [item]: true};
      });
    }
  }
  return (
    <div>
      {actionList.map((userAction) => (
        <FormControlLabel
          key={userAction}
          value="start"
          label={userAction}
          disabled={isCompletedDictionary[userAction]}
          name={userAction}
          control={<Checkbox color="primary" onChange={handleCheckboxSelect} />}
        />
      ))}
    </div>
  );
}

function getUserStateActions(state) {
  return Object.keys(
    state.currentSettings.userActionsValueDictionary.physicalState,
  );
}

function getUserStateActionValue({state, itemName}) {
  return state.currentSettings.userActionsValueDictionary.physicalState[
    itemName
  ];
}
function getUserOneTimeActions(state) {
  return Object.keys(
    state.currentSettings.userActionsValueDictionary.oneTimeActions,
  );
}
function getUserOneTimeActionValue({state, itemName}) {
  return state.currentSettings.userActionsValueDictionary.oneTimeActions[
    itemName
  ];
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
  // const percentOverMax = Math.max(gameState.progressAmount - 100, 0);
  const progressPoints = Math.floor(gameState.progressAmount / 20);

  const totalPoints = progressPoints + gameState.userActionPoints;
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

  const shouldGiveRandomReward = getShouldGiveRandomReward({
    probabilityDecimal: 0.6,
    seed: gameState.randomSeed,
  });

  const rewardAddition = shouldGiveRandomReward ? 1 : 0;
  dispatch(setRewardAction(gameState.totalReward + rewardAddition));
}
function doNothing(gameState) {
  return gameState;
}
function createState() {
  let gameState = {
    ...createGameState(),
    currentSettings: {...settings},
    progressAmount: 0,
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

          const shouldGiveRandomReward = getShouldGiveRandomReward({
            probabilityDecimal: 0.6,
            seed: gameState.randomSeed,
          });
          if (shouldGiveRandomReward) {
            newState = reduceGameState(
              newState,
              setUserPointsAction(gameState.userActionPoints + 3),
            );
          }

          return newState;
        });
      },
    }),
  });
  return gameState;
}

function setRewardAction(amount) {
  return {
    type: "SET_CURRENT_AND_PREVIOUS_VARIABLE",
    property: "totalReward",
    value: amount,
  };
}
function setUserPointsAction(amount) {
  return {
    type: "SET_VARIABLE",
    property: "userActionPoints",
    value: amount,
  };
}

function getShouldGiveRandomReward({probabilityDecimal, seed}) {
  const max = 1000;
  const minimumAcceptable = probabilityDecimal * max;
  const randomNumberBetween1and100 = getRandomIntInclusive({
    min: 1,
    max: max,
    seed: seed,
  });
  return randomNumberBetween1and100 < minimumAcceptable;
}
function pauseGame() {
  return {
    type: "SET_VARIABLE",
    property: "isVisible",
    value: false,
  };
}
function unpauseGame() {
  return {
    type: "SET_VARIABLE",
    property: "isVisible",
    value: true,
  };
}
