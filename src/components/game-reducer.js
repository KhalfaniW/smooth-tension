import produce from "immer";

import {checkOpeningRandomReward} from "components/game/game-tools";

import {createRandomSeedState, randomReducer} from "./random-reducer";
import {createTimerState, timeReducer} from "./time-reducer";

export function reduceGameState(state, action) {
  const stateWithUpdatedRandomness = randomReducer(state, action);
  const stateReducedByTimer = timeReducer(stateWithUpdatedRandomness, action);
  const oldState = stateReducedByTimer;
  return produce(oldState, (draftState) => {
    switch (action.type) {
      case "SET_PROGRESS_INCREMENT_SPEED":
        let newState2 = produce(oldState, (draftState) => {
          draftState.speedMultiplier = action.speedMultiplier;
        });

        const newInterval =
          oldState.defaultIncrementInterval / action.speedMultiplier;

        return reduceGameState(newState2, {
          type: "SET_EVENT_INTERVAL",
          eventId: "UPDATE_PROGRESS_ID",
          newInterval: newInterval,
        });
      case "INCREASE_PROGRESS_INCREMENT_SPEED":
        return reduceGameState(state, {
          type: "SET_PROGRESS_INCREMENT_SPEED",
          speedMultiplier: state.speedMultiplier + action.amount,
        });

      case "DECREASE_PROGRESS_INCREMENT_SPEED":
        return reduceGameState(state, {
          type: "SET_PROGRESS_INCREMENT_SPEED",
          speedMultiplier: state.speedMultiplier - action.amount,
        });

      case "USE_A_POINT":
        return reduceGameState(state, {
          type: "SET_VARIABLE",
          property: "pointsUsed",
          value: state.pointsUsed + 1,
        });

      case "USE_POINTS":
        return reduceGameState(state, {
          type: "SET_VARIABLE",
          property: "pointsUsed",
          value: state.pointsUsed + action.amount,
        });
      case "SET_CURRENT_AND_PREVIOUS_VARIABLE":
        draftState["previous_" + action.property] = draftState[action.property];
        draftState[action.property] = action.value;

        break;
      case "SET_VARIABLE":
        draftState[action.property] = action.value;
        break;
      case "SET_OBJECT": //TODO remove
        draftState[action.property] = action.value;
        break;
      case "BEGIN_WAITING_FOR_REWARD":
        draftState.isWaitingForRewardWheel = true;
        draftState.pointAnimationCount++;
        break;
      case "END_WAITING_FOR_REWARD":
        draftState.isWaitingForRewardWheel = false;
        break;
      case "BEGIN_WAITING_TO_HIDE_REWARD_CREATOR":
        draftState.isWaitingToHideWheel = true;
        break;
      case "END_WAITING_TO_HIDE_REWARD_CREATOR":
        draftState.isWaitingToHideWheel = false;
        break;
      case "RESET_GAME":
        return initializeState({
          emptyGameState: createGameState(),
          gameSettings: state.currentSettings,
          now: action.now,
        });
      case "INCREASE_POINTS":
        draftState.userActionPoints += action.amount;
        break;

      case "COMPLETE_USER_ACTION":
        console.log({n: action.name, d: draftState.finalAction});
        if (action.name === draftState.finalAction) {
          draftState.userActionPoints += 1;
          draftState.currentSettings.spinWinProbability = 1;
          return;
        }
        let newState3 = produce(oldState, (draftState) => {
          draftState.userActions[action.name].isComplete = true;
        });
        return reduceGameState(newState3, {
          type: "INCREASE_POINTS",
          amount: newState3.userActions[action.name].value,
        });
      case "TOGGLE_BOOLEAN":
        draftState[action.property] = !draftState[action.property];
        break;

      default:
        return draftState;
    }
  });
}
export function initializeState({emptyGameState, gameSettings, now}) {
  let gameState = {
    ...emptyGameState,
    currentSettings: {...gameSettings},
    progressAmount: 0,
    seed: now,
    timeSinceEpochMS: now,
    startTime: now,
    isFocusModeEnabled: true,
  };
  const actionValues = gameSettings.userActionsValueDictionary.oneTimeActions;
  const userActionList = Object.keys(actionValues);

  const userActionMap = userActionList.reduce((actionMap, action) => {
    return {
      ...actionMap,
      [action]: {isComplete: false, value: actionValues[action]},
    };
  }, {});
  gameState.userActions = userActionMap;
  if (gameState.finalAction == "") {
    gameState.finalAction = gameSettings.finalAction;
    gameState = checkOpeningRandomReward(gameState);
  }
  return gameState;
}

export function createGameState(seed = 5) {
  return {
    ...createRandomSeedState(seed),
    ...createTimerState(),
    totalReward: 0,
    userActionPoints: 0,
    isTimerRunning: false,
    initialReward: 0,
    isRandomRewardChecked: false,
    isWaitingToHideWheel: false,
    openingRewardAmount: 0,
    progressAmount: 0,
    defaultIncrementInterval: 1000,
    pointAnimationCount: 0,
    incrementAmount: 0.1,
    speedMultiplier: 1,
    userActions: {},
    finalAction: "",
    isWaitingForRewardWheel: false,
    isVisible: true,
    pointsUsed: 0,
    previousRewardForOpeningTimeSinceEpoch: 0,
  };
}
export function pauseGame() {
  return {
    type: "SET_VARIABLE",
    property: "isVisible",
    value: false,
  };
}
export function unPauseGame() {
  return {
    type: "SET_VARIABLE",
    property: "isVisible",
    value: true,
  };
}
