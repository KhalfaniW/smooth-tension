import produce from "immer";

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
      case "SET_OBJECT": //TODO remov
        draftState[action.property] = action.value;
        break;

      case "TOGGLE_BOOLEAN":
        draftState[action.property] = !draftState[action.property];
        break;

      default:
        return draftState;
    }
  });
}
export function createGameState(seed = 5) {
  return {
    ...createRandomSeedState(seed),
    ...createTimerState(),
    totalReward: 0,
    userActionPoints: 0,
    initialReward: 0,
    isRandomRewardChecked: false,
    progressAmount: 0,
    defaultIncrementInterval: 1000,
    incrementAmount: 0.1,
    speedMultiplier: 1,
    isVisible: true,
    pointsUsed: 0,
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
