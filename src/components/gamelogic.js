import produce from "immer";

import { createTimerState, timeReducer } from './time-reducer';

export function reduceGameState(state, action) {
  const stateReducedByTimer = produce(state, (draftState) => {
    return timeReducer(state, action);
  });
  return produce(stateReducedByTimer, (draftState) => {
    const oldState = stateReducedByTimer;
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

      case "SET_VARIABLE":
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
export function createGameState() {
  const defaultTimerState = createTimerState();
  return {
    ...defaultTimerState,
    reward: 0,
    isRandomRewardChecked: false,
    progressAmount: 88,
    defaultIncrementInterval: 1000,
    incrementAmount: 0.1,
    speedMultiplier: 1,
    isVisible: true,
    randomSeed: 5,
  };
}
