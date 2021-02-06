import {useInterval} from "ahooks";
import PageVisibility from "react-page-visibility";
import React, {useState} from "react";

import {ActionProgress} from "components/game/game-progress";
import {GameWrapper, HoldTensionBox, ReleaseTensionBox} from "styles/boxes";
import {UserOneTimeActions} from "components/game/user-actions";
import {
  changeRandomReward,
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
export function Game({
  state = initializeState({
    now: Date.now(),
    emptyGameState: createGameState(),
    gameSettings: obtainSettings(),
  }),

  seed = Date.now(),
}) {
  const [gameState, setGameState] = useState(state);
  //TODO refractor previous with usePrevious for all properties not needed to be used by reducer

  function dispatch(event) {
    setGameState((gameState) => reduceGameState(gameState, event));
  }

  // if (isPending) return "Loading...";

  return <GameView gameState={gameState} dispatch={dispatch} />;
}

function GameView({gameState, dispatch}) {
  //TODO replace with use previous
  const allComputedProperties = getComputedProperties(gameState);
  const [
    isInititialRewardAnimationComplete,
    setIsRewardAnimationComplete,
  ] = useState(false);

  const [shouldRelease, setShouldRelease] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (gameState.isComplete) {
    return <EndScreenOverlay gameState={gameState} dispatch={dispatch} />;
  }
  return (
    <>
      <button
        onClick={() => {
          dispatch({
            type: "END_GAME",
            now: Date.now(),
            setting: gameState.currentSettings,
          });
        }}
      >
        rest
      </button>

      <PageVisibility
        onChange={(isVisible1) => {
          const pauseOrUnpauseGame = isVisible1 ? unPauseGame() : pauseGame();
          dispatch(pauseOrUnpauseGame);
          setIsVisible(isVisible1);
        }}
      ></PageVisibility>

      <GameWrapper
        onMouseEnter={() => {
          dispatch(unPauseGame());
        }}
        onMouseLeave={() => {
          dispatch(pauseGame());
        }}
      >
        <HoldOrReleaseCommand
          shouldRelease={
            allComputedProperties.lastReward > 0 &&
            !gameState.isWaitingForRewardWheel
          }
        />
        <PointCalculationAnimation gameState={gameState} dispatch={dispatch} />

        <PointsShop
          gameState={gameState}
          dispatch={dispatch}
          //TODO move animation
          shouldShowPoints={
            isInititialRewardAnimationComplete &&
            !gameState.isWaitingForRewardWheel
          }
        />
        <GainPointsUserActions gameState={gameState} dispatch={dispatch} />
      </GameWrapper>
    </>
  );
}

function PointsStatusInformation({gameState}) {
  const computedProperties = getComputedProperties(gameState);
  const {isActivityComplete} = {
    ...gameState,
    ...computedProperties,
  };

  let statusMessage = null;
  if (isActivityComplete) {
    statusMessage = <div>Activity Complete </div>;
  } else {
  }

  return <>{statusMessage}</>;
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
            dispatch({type: "RESET_GAME"});
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
  const actionValues = getUserOneTimeActionValues(gameState);
  return (
    <>
      <div>
        <h2>Gain Points</h2>
        {/* <ActionProgress /> */}
        <UserOneTimeActions
          actionList={actionNames}
          valueList={actionValues}
          onComplete={(itemSelected) => {
            const userActionValue = getUserOneTimeActionValue({
              state: gameState,
              itemName: itemSelected,
            });

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
