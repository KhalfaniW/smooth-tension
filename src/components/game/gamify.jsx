import PageVisibility from "react-page-visibility";
import React, {useState} from "react";

import {HoldTensionBox, ReleaseTensionBox} from "styles/boxes";
import {UserOneTimeActions} from "components/game/user-actions";
import {
  createGameState,
  initializeState,
  pauseGame,
  reduceGameState,
  unPauseGame,
} from "components/game-reducer";
import {
  getComputedProperties,
  getUserOneTimeActionValues,
  getUserOneTimeActions,
} from "components/game/game-tools";
import {obtainSettings} from "components/game/game-settings";
import EndView from "components/game/end-view";
import PointCalculationAnimation from "components/game/point-calculation-animation";
import PointsShop from "components/game/points-shop";

const minutesToMS = (minutes) => minutes * 60 * 1000;
const coolDownTimeMS = minutesToMS(10);
const rewardDelayAnimationTime = 1000;
//reset should  be a level above to remount and reset effects
const defaultInitialState = initializeState({
  now: Date.now(),
  emptyGameState: createGameState(),
  gameSettings: obtainSettings(),
});
export function Game({state = defaultInitialState}) {
  const [gameState, setGameState] = useState(state);
  //TODO refractor previous with usePrevious for all properties not needed to be used by reducer

  function dispatch(event) {
    setGameState((gameState) => reduceGameState(gameState, event));
  }

  // if (isPending) return "Loading...";

  return (
    <>
      <PageVisibility
        onChange={(isVisible1) => {
          const pauseOrUnpauseGame = isVisible1 ? unPauseGame() : pauseGame();
          dispatch(pauseOrUnpauseGame);
        }}
      ></PageVisibility>
      <GameView gameState={gameState} dispatch={dispatch} />
    </>
  );
}

function GameView({gameState, dispatch}) {
  const allComputedProperties = getComputedProperties(gameState);

  return (
    <>
      <div className="flex flex-col items-center justify-between h-full">
        <HoldOrReleaseCommand
          shouldRelease={
            allComputedProperties.lastReward > 0 &&
            !gameState.isWaitingForRewardWheel
          }
        />
        <PointCalculationAnimation gameState={gameState} dispatch={dispatch} />
        <StatusInformation gameState={gameState} />
        {allComputedProperties.isActivityComplete ? (
          <EndView gameState={gameState} dispatch={dispatch} />
        ) : (
          <>
            <PointsShop
              gameState={gameState}
              dispatch={dispatch}
              //TODO move animation
              shouldShowPoints={!gameState.isWaitingForRewardWheel}
            />
            <GainPointsUserActions gameState={gameState} dispatch={dispatch} />
          </>
        )}
      </div>
    </>
  );
}

function StatusInformation({gameState}) {
  const computedProperties = getComputedProperties(gameState);
  const {isActivityComplete, openingRewardAmount, hasReceivedOpeningReward} = {
    ...gameState,
    ...computedProperties,
  };

  if (!isActivityComplete && hasReceivedOpeningReward) {
    return <div>Free Spins Won By Opening App: {openingRewardAmount}</div>;
  }

  return null;
}

function GainPointsUserActions({gameState, dispatch}) {
  const actionNames = getUserOneTimeActions(gameState);
  const completedNames = actionNames.filter((name) => {
    const isCheckingFinalActionIsDone = name === gameState.finalAction;
    if (isCheckingFinalActionIsDone) {
      return false;
    }
    return gameState.userActions[name].isComplete;
  });
  const actionValues = getUserOneTimeActionValues(gameState);
  return (
    <>
      <div className="pt-4">
        <UserOneTimeActions
          actionList={actionNames}
          completedList={completedNames}
          valueList={actionValues}
          onComplete={(itemSelected) => {
            dispatch({
              type: "COMPLETE_USER_ACTION",
              name: itemSelected,
            });
          }}
        />
      </div>
    </>
  );
}

function HoldOrReleaseCommand({shouldRelease}) {
  if (shouldRelease) {
    return (
      <>
        <ReleaseTensionBox>
          <h2>Release Tension</h2>
        </ReleaseTensionBox>
      </>
    );
  }
  return (
    <>
      <HoldTensionBox>
        <h2>Hold Tension</h2>
      </HoldTensionBox>
    </>
  );
}
