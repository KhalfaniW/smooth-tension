import React from "react";

import {
  changeRewardAction,
  getComputedProperties,
  getShouldGiveRandomReward,
} from "components/game/game-tools";

export default function PointsShop({gameState, dispatch, shouldShowPoints}) {
  const computedProperties = getComputedProperties(gameState);
  const {
    isWaitingForRewardWheel,
    totalPoints,
    pointsRemaining,
    lastReward,
    isSpinningDisabled,
    totalReward,
  } = {
    ...gameState,
    ...computedProperties,
  };
  return (
    <div>
      <div>{`Spins Remaining ${pointsRemaining}`}</div>
      <div>
        {pointsRemaining === 0 ? (
          `Get spins by completing actions below `
        ) : (
          <button
            disabled={isSpinningDisabled}
            onClick={() => {
              spendAPoint({dispatch: dispatch, gameState: gameState});
              dispatch({type: "BEGIN_WAITING_FOR_REWARD"});
              dispatch({type: "BEGIN_WAITING_TO_HIDE_REWARD_CREATOR"});
            }}
          >
            Spin Wheel
          </button>
        )}
      </div>
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
    probabilityDecimal: gameState.currentSettings.probabiltyOfWinPercentDecimal,
    seed: gameState.seed,
  });

  const rewardAddition = shouldGiveRandomReward ? 1 : 0;
  dispatch(changeRewardAction(gameState.totalReward + rewardAddition));
}
