import produce from "immer";
import * as _ from "lodash";
import seedrandom from "seedrandom";

//note this does not simulate randomness it simulated entropy because randomness
//is not testable
export function randomReducer(state, action) {
  return produce(state, (draftState) => {
    switch (action.type) {
      case "UPDATE_SEED":
        draftState.seed = seedrandom(draftState.seed)();
        return draftState;
      default:
        return state;
    }
  });
}
//defaults to int
export function getRandomIntInclusive({min, max, seed}) {
  const randomDecimalNumber = seedrandom(seed)();
  const finalNum = randomDecimalNumber * (max - min + 1) + min;
  return Math.floor(finalNum);
}
export function getRandomBoolean({probabilityOfTrue, seed}) {
  const max = 1000;
  const minimumAcceptable = probabilityOfTrue * max;
  const randomNumberBetween1and100 = getRandomIntInclusive({
    min: 1,
    max: max,
    seed: seed,
  });
  return randomNumberBetween1and100 < minimumAcceptable;
}

export function getRandomNumberGroup({count, min, max, seed}) {
  return _.range(0, count).map((n, animationIndex) => {
    const indexEntropy = animationIndex;
    return getRandomIntInclusive({
      max,
      min,
      seed: seed + indexEntropy,
    });
  });
}

export function createRandomSeedState(seed) {
  return {seed: seed};
}
