import React, {useState} from "react";

import {getRandomIntInclusive} from "./random-reducer";

export function RandomRewardCreator({
  seed = Math.random() * 1000, //TODO let it be less than 0 seed only looks at numbers >0
  successProbabilityPercentDecimal,
}) {
  const getReward = (seed) => {
    return getRandomIntInclusive({min: 1, max: 100, seed: seed});
  };

  const [newSeed, setNewSeed] = useState(seed);

  function updateSeed() {
    //it will loop back to the same number with insufficient entropy [only selecting 1-100], so add more entropy
    const newSeed = getRandomIntInclusive({
      min: 1,
      max: 1000000,
      seed: seed,
    });
    setNewSeed(newSeed);
  }

  return (
    <div>
      <button
        onClick={() => {
          updateSeed();
        }}
      >
        Get newSeed
      </button>
      {getReward(newSeed)}
    </div>
  );
}
