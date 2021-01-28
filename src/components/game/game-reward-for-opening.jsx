import {useTimeout} from "ahooks";
import React, {useEffect, useState} from "react";
import parseMilliseconds from "parse-ms";

export default function MaybeRewardForOpening({
  gameState,
  onRewardShown,
  coolDownTimeMS,
}) {
  //put reward on cooldown after opening

  const timeSinceLastReward =
    gameState.timeSinceEpochMS -
    gameState.previousRewardForOpeningTimeSinceEpoch;
  const has5SecondsPassedSinceReward = timeSinceLastReward > 5 * 1000;
  const countDownToNextRandomRewardMS = coolDownTimeMS - timeSinceLastReward;
  const timeLeft = parseMilliseconds(countDownToNextRandomRewardMS);
  return (
    <>
      <ShowReward
        rewardAmount={gameState.userActionPoints}
        onRewardShown={onRewardShown}
      />

      {has5SecondsPassedSinceReward
        ? `${timeLeft.minutes}m:${timeLeft.seconds}`
        : null}
    </>
  );
}

function ShowReward({rewardAmount, delay = 1000, onRewardShown}) {
  // useDelay
  const [isDoneLoading, setIsDoneLoading] = useState(false);
  useTimeout(() => {
    setIsDoneLoading(true);
    onRewardShown();
  }, delay);
  return (
    <>
      {isDoneLoading ? <div>Reward: {rewardAmount}</div> : <>Calculating...</>}
    </>
  );
}
