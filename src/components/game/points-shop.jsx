import React from "react";

import {
  changeRewardAction,
  getComputedProperties,
  getShouldGiveRandomReward,
} from "components/game/game-tools";

export default function PointsShop({gameState, dispatch, shouldShowPoints}) {
  const computedProperties = getComputedProperties(gameState);
  const {
    isWaitingForReward,
    totalPoints,
    pointsRemaining,
    lastReward,
    totalReward,
  } = {
    ...gameState,
    ...computedProperties,
  };
  return (
    <div>
      <div>
        {shouldShowPoints ? `Points ${pointsRemaining}/${totalPoints}` : null}
      </div>
      <div>
        {isWaitingForReward
          ? `Calculating progress Addendum`
          : ` Total ${totalReward}/3  
\n           last reward ${lastReward}`}
      </div>
      <button
        disabled={pointsRemaining < 1 || gameState.isWaitingToHideRewardCreator}
        onClick={() => {
          spendAPoint({dispatch: dispatch, gameState: gameState});
          dispatch({type: "BEGIN_WAITING_FOR_REWARD"});
          dispatch({type: "BEGIN_WAITING_TO_HIDE_REWARD_CREATOR"});
        }}
      >
        Use Point
      </button>
    </div>
  );
}
function spendAPoint({gameState, dispatch}) {
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
