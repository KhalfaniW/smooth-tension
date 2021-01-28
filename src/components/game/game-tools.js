import produce from "immer";

import {createOneTimeEvent, getIsEventPending} from "components/time-reducer";
import {getRandomIntInclusive, randomReducer} from "components/random-reducer";
import {reduceGameState} from "components/game-reducer";

export function getUserOneTimeActions(state) {
  return Object.keys(
    state.currentSettings.userActionsValueDictionary.oneTimeActions,
  );
}
export function getUserOneTimeActionValue({state, itemName}) {
  return state.currentSettings.userActionsValueDictionary.oneTimeActions[
    itemName
  ];
}

export function getPreviousPropertyValue({state, property}) {
  const previous = state["previous_" + property];
  if (typeof previous === "undefined") {
    return state[property];
  }
  return previous;
}
export function getComputedProperties(gameState) {
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
export function spendAPoint({gameState, dispatch}) {
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
    seed: gameState.seed,
  });

  const rewardAddition = shouldGiveRandomReward ? 1 : 0;
  dispatch(changeRewardAction(gameState.totalReward + rewardAddition));
}
export function doNothing(gameState) {
  return gameState;
}
export function incrementProgress(gameState) {
  if (gameState.isFocusModeEnabled && gameState.isVisible) {
    return reduceGameState(gameState, {
      type: "SET_VARIABLE",
      property: "progressAmount",
      value: gameState.progressAmount + gameState.incrementAmount,
    });
  }
  return gameState;
}

export function getIsTimeToGiveOpeningRewardWithCoolDown({
  gameState,
  coolDownTimeMS,
}) {
  // const isFirstTimeRunning =
  //   gameState.previousRewardForOpeningTimeSinceEpoch <= 10;
  const lastRewardTimeMS = gameState.previousRewardForOpeningTimeSinceEpoch;
  const nextTimeToGiveReward = coolDownTimeMS + lastRewardTimeMS;
  const isTimeForNextReward =
    gameState.timeSinceEpochMS >= nextTimeToGiveReward;
  return isTimeForNextReward;
}

export function changeRandomReward(gameState) {
  return produce(gameState, (draftState) => {
    const stateWithUpdatedTime = produce(gameState, (draftState1) => {
      draftState1.isRandomRewardChecked = true;
      draftState1.previousRewardForOpeningTimeSinceEpoch =
        gameState.timeSinceEpochMS;
    });
    const {
      newState,
      shouldGiveRandomReward,
    } = getShouldGiveRandomRewardFromState({
      state: stateWithUpdatedTime,
      probabilityDecimal: 0.5,
    });

    if (shouldGiveRandomReward) {
      return reduceGameState(
        newState,
        changeUserPointsAction(gameState.userActionPoints + 3),
      );
    }

    return newState;
  });
}

export function changeRewardAction(amount) {
  return {
    type: "SET_CURRENT_AND_PREVIOUS_VARIABLE",
    property: "totalReward",
    value: amount,
  };
}
export function changeUserPointsAction(amount) {
  return {
    type: "SET_VARIABLE",
    property: "userActionPoints",
    value: amount,
  };
}

export function getRandomNumberFromState({state, min, max}) {
  return {
    newState: randomReducer(state, {type: "UPDATE_SEED"}),
    randomNumber: getRandomIntInclusive({
      min: min,
      max: max,
      seed: state.seed,
    }),
  };
}

export function getShouldGiveRandomRewardFromState({
  state,
  probabilityDecimal,
}) {
  return {
    newState: randomReducer(state, {type: "UPDATE_SEED"}),
    shouldGiveRandomReward: getShouldGiveRandomReward({
      probabilityDecimal,
      seed: state.seed,
    }),
  };
}

export function getShouldGiveRandomReward({probabilityDecimal, seed}) {
  const max = 1000;
  const minimumAcceptable = probabilityDecimal * max;
  const randomNumberBetween1and100 = getRandomIntInclusive({
    min: 1,
    max: max,
    seed: seed,
  });
  return randomNumberBetween1and100 < minimumAcceptable;
}
