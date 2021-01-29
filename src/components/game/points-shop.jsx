import React from "react";

import {getComputedProperties, spendAPoint} from "components/game/game-tools";

export default function PointsShop({gameState, dispatch, shouldShowPoints}) {
  const computedProperties = getComputedProperties(gameState);
  const {
    totalPoints,
    pointsRemaining,
    lastReward,
    totalReward,
    isWaitingForReward,
  } = {...gameState, ...computedProperties};
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
        onClick={() => {
          dispatch({
            type: "INCREASE_PROGRESS_INCREMENT_SPEED",
            amount: 0.5,
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
      <button
        disabled={pointsRemaining < 1 || isWaitingForReward}
        onClick={() => {
          spendAPoint({dispatch: dispatch, gameState: gameState});
        }}
      >
        Use Point
      </button>
    </div>
  );
}
