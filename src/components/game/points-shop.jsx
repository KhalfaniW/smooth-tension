import React, {useState, useEffect} from "react";

export default function PointsShop({
  onSpendAPoint,
  dispatch,

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
          onSpendAPoint();
        }}
      >
        Use Point
      </button>
    </div>
  );
}
