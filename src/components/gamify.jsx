import {Checkbox, FormControlLabel} from "@material-ui/core";
import {Spring} from "react-spring/renderprops";
import {throttle} from "lodash";
import NumberFormat from "react-number-format";
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
import {settings, resistingSettings} from "./game-settings";
import {useLocalStorage} from "react-use";

export function Game({
  state = createState(),
  seed = Date.now(),
  currentTimeMS = Date.now(),
  onGameStateUpdate = () => {},
  //TODO move pause state up
  isPaused = null,
  isVisible = true,
}) {
  const storageKey = "DEMO_12345";
  const defaultGameState = {
    ...state,
    seed: seed,
    timeSinceEpochMS: currentTimeMS,
    startTime: currentTimeMS,
    isVisible: isVisible,
  };
  const [savedGameStateString, setsavedGameStateString] = useLocalStorage(
    storageKey,
    JSON.stringify(defaultGameState),
  );

  const [gameState, setGameState] = useState(JSON.parse(savedGameStateString));

  if (gameState.isVisible !== isVisible) {
    dispatch({
      type: "SET_VARIABLE",
      property: "isVisible",
      value: isVisible,
    });
  }
  const saveStateTimeSafe = throttle(
    () => setsavedGameStateString(JSON.stringify(gameState)),
    1000,
  );
  function dispatch(event) {
    setGameState((gameState) => reduceGameState(gameState, event));
  }
  const setupTimeEffect = () => {
    const timer = setInterval(() => {
      dispatch({
        type: "HANDLE_UNRELIABLE_TIME_TICK",
        timeSinceEpochMS: Date.now(),
        timeFunctionDictionary: {incrementProgress, setRandomReward, doNothing},
      });
    }, gameState.millisecondsPerTick);

    return () => {
      clearInterval(timer);
    };
  };

  const startEffect = () => {
    dispatch({
      type: "SET_VARIABLE",
      property: "isFocusModeEnabled",
      value: true,
    });
  };

  useEffect(setupTimeEffect, [gameState.millisecondsPerTick]);
  useEffect(startEffect, []);
  // if (isPending) return "Loading...";
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
      <button
        onClick={() => {
          saveStateTimeSafe();
        }}
      >
        Save
      </button>
      <br /> <br /> <br />
      Keep Mouse in this area
      <button
        onClick={() => {
          dispatch({
            type: "SET_VARIABLE",
            property: "isFocusModeEnabled",
            value: true,
          });
        }}
      >
        I am tempted
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
        I am just bored
      </button>
      <Spring from={{value: 50}} to={{value: 90}} config={{duration: 5000}}>
        {(props) => (
          <div style={{width: "70%"}}>
            {/* <ReactBootstrapStyle /> */}
            {/* <ProgressBar now={props.value} /> */}
            {"Time Value"}
            <br />
            {Math.min(
              100,
              props.value + pointsRemaining + gameState.userActionPoints,
            ).toFixed(0)}
            /100
            <br />
            {"Points on completing 10\n"}
          </div>
        )}
      </Spring>
      <ProgressView progressAmount={gameState.progressAmount} />
      <div>{gameState.isVisible ? "" : "Paused"}</div>
      <div>
        Speed:{" "}
        <NumberFormat
          value={gameState.speedMultiplier}
          displayType={"text"}
          thousandSeparator={true}
          prefix={""}
        />
        {/* {getNumberStringOptionalRounding({ */}
        {/*   number: gameState.speedMultiplier, */}
        {/*   maxDecimal: 2, */}
        {/* })} */}
      </div>
      <div>{gameState.isFocusModeEnabled ? "focused" : null} </div>
      <button
        onClick={() => {
          dispatch({
            type: "INCREASE_PROGRESS_INCREMENT_SPEED",
            amount: 0.1,
          });
        }}
      >
        Increase by .1
      </button>
      <button
        disabled={pointsRemaining < 1}
        onClick={() => {
          dispatch({
            type: "USE_POINTS",
            amount: 1,
          });
        }}
      >
        Invest Point
      </button>
      <div>
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
        <div>Open App Points: {gameState.userActionPoints}</div>
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
//Start
const stateStorageSettings = {userId: "DEMO_USER", itemName: "gameState"};
async function retrieveStoredState({storageSettings, defaultValue}) {
  await null;
  const key = storageSettings.userId + storageSettings.name;

  return window.localStorage.getItem(key) || defaultValue;
}
function saveState({storageSettings, value}) {
  const key = storageSettings.userId + storageSettings.name;
  window.localStorage.setItem(key, JSON.stringify(value));
}
//End
export function ProgressView({progressAmount}) {
  return <div>Power {progressAmount.toFixed(1)}</div>;
}

export function PointsShop({
  onSpendAPoint,
  totalPoints,
  pointsRemaining,
  isWaitingForReward,
  totalReward,
}) {
  const isAbleToSpendAPoint = pointsRemaining < 1 || isWaitingForReward;
  return (
    <div>
      <div>
        {isWaitingForReward
          ? `Calculating progress Addendum`
          : ` Total Score ${totalReward}/3 goal `}
      </div>
      <button
        disabled={isAbleToSpendAPoint}
        onClick={() => {
          onSpendAPoint();
        }}
      >
        Try Buy Final Reward
      </button>
      <button
        disabled={isAbleToSpendAPoint}
        onClick={() => {
          onSpendAPoint();
        }}
      >
        Buy increase in time incrementer
      </button>
      <button
        disabled={isAbleToSpendAPoint}
        onClick={() => {
          onSpendAPoint();
        }}
      >
        Increase probabilty of getting reward
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
  };
}
function spendAPoint({gameState, dispatch}) {
  dispatch({
    type: "ADD_ONE_TIME_EVENT",
    oneTimeEvent: createOneTimeEvent({
      id: "WAIT_TO_SHOW_REWARD_ID",
      runTime: gameState.millisecondsPassed + 1000,
      functionName: "doNothing",
    }),
  });
  dispatch({
    type: "USE_A_POINT",
  });

  dispatch({
    type: "UPDATE_SEED",
  });

  const shouldGiveRandomReward = getShouldGiveRandomReward({
    probabilityDecimal: 0.5,
    seed: gameState.randomSeed,
  });

  const rewardAddition = shouldGiveRandomReward ? 1 : 0;
  dispatch(setRewardAction(gameState.totalReward + rewardAddition));
}
function doNothing(gameState) {
  return gameState;
}
function incrementProgress(gameState) {
  if (gameState.isFocusModeEnabled && gameState.isVisible) {
    return reduceGameState(gameState, {
      type: "SET_VARIABLE",
      property: "progressAmount",
      value: gameState.progressAmount + gameState.incrementAmount,
    });
  }
  return gameState;
}

function setRandomReward(gameState) {
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
      functionName: "incrementProgress",
    }),
  });
  gameState = reduceGameState(gameState, {
    type: "ADD_ONE_TIME_EVENT",
    oneTimeEvent: createOneTimeEvent({
      id: "SHOW_DELAYED_REWARD_ID",
      runTime: 1000,
      functionName: "setRandomReward",
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
