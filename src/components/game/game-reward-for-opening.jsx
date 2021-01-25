import {useTimeout} from "react-use";
import React, {useState} from "react";

export default function RewardForOpening({gameState, delay = 1000}) {
  // useDelay
  const [getIsReady, cancel] = useTimeout(delay);

  return (
    <>
      {getIsReady() ? (
        <div>Reward: {gameState.userActionPoints}</div>
      ) : (
        <>Calculating...</>
      )}
    </>
  );
}
