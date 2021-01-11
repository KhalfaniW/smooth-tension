import produce from "immer";
import seedrandom from "seedrandom";
//note this does not simulate randomness it simulated entropy because randomness
//is not testable
export function randomReducer(state, action) {
  return produce(state, (draftState) => {
    switch (action.type) {
      case "UPDATE_SEED":
        draftState.seed = seedrandom(draftState.seed);
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
export function createRandomSeedState(seed) {
  return {seed: seed};
}
