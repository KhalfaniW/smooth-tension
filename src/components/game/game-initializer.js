import {changeRandomReward} from "components/game/game-tools";
import {createGameState, reduceGameState} from "components/game-reducer";
import {createIntervalEvent, createOneTimeEvent} from "components/time-reducer";
import {obtainSettings} from "components/game/game-settings";

export function createState() {
  let gameState = {
    ...createGameState(),
    currentSettings: {...obtainSettings()},
    progressAmount: 0,
  };

  gameState = reduceGameState(gameState, {
    type: "ADD_INTERVAL_EVENT",
    intervalEvent: createIntervalEvent({
      id: "UPDATE_PROGRESS_ID",
      intervalMilliseconds:
        gameState.defaultIncrementInterval / gameState.speedMultiplier,
      functionName: "incrementProgress",
    }),
  });

  return gameState;
}
