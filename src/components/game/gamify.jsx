import {useInterval} from "ahooks";
import PageVisibility from "react-page-visibility";
import React, {useState} from "react";

import {ActionProgress} from "components/game/game-progress";
import {HoldTensionBox, ReleaseTensionBox} from "styles/boxes";
import {UserOneTimeActions} from "components/game/user-actions";
import {
  checkOpeningRandomReward,
  changeUserPointsAction,
  doNothing,
  getComputedProperties,
  getUserOneTimeActionValue,
  getUserOneTimeActionValues,
  getUserOneTimeActions,
  incrementProgress,
} from "components/game/game-tools";
import {
  createGameState,
  initializeState,
  pauseGame,
  reduceGameState,
  unPauseGame,
} from "components/game-reducer";
import {obtainSettings} from "components/game/game-settings";
import MaybeRewardForOpening from "components/game/game-reward-for-opening";
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
        {gameState.isComplete ? (
          <EndScreenOverlay gameState={gameState} dispatch={dispatch} />
        ) : (
          <PointsShop
            gameState={gameState}
            dispatch={dispatch}
            //TODO move animation
            shouldShowPoints={!gameState.isWaitingForRewardWheel}
          />
        )}
        <GainPointsUserActions gameState={gameState} dispatch={dispatch} />
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

  if (isActivityComplete) {
    return <div>Activity Complete </div>;
  } else if (hasReceivedOpeningReward) {
    return <div>Free Spins Won By Opening App: {openingRewardAmount}</div>;
  }

  return null;
}

function EndScreenOverlay({gameState, dispatch}) {
  return (
    <>
      <div>
        <h3>Training Complete</h3>
        <p>To get the full benefits, execute on the plan you set in place</p>
        <ul>
          <li>Open Habit Tracking App</li>
          <li>Open a Website blocker</li>
        </ul>
        <button
          onClick={() => {
            dispatch({type: "RESET_GAME", now: Date.now()});
          }}
        >
          Reset
        </button>
      </div>
    </>
  );
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
        <h2>Gain Points</h2>
        {/* <ActionProgress /> */}
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
