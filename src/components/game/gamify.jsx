import {useInterval} from "ahooks";
import PageVisibility from "react-page-visibility";
import React, {useState, useEffect} from "react";

import {ActionProgress} from "components/game/game-progress";
import {GameWrapper, HoldTensionBox, ReleaseTensionBox} from "styles/boxes";
import {UserOneTimeActions} from "components/game/user-actions";
import {
  changeRandomReward,
  changeUserPointsAction,
  doNothing,
  getComputedProperties,
  getIsTimeToGiveOpeningRewardWithCoolDown,
  getUserOneTimeActionValue,
  getUserOneTimeActionValues,
  getUserOneTimeActions,
  incrementProgress,
} from "components/game/game-tools";
import {createState} from "components/game/game-initializer";
import {pauseGame, reduceGameState, unPauseGame} from "components/game-reducer";
import MaybeRewardForOpening from "components/game/game-reward-for-opening";
import PointCalculationAnimation from "components/game/point-calculation-animation";
import PointsShop from "components/game/points-shop";

const minutesToMS = (minutes) => minutes * 60 * 1000;
const coolDownTimeMS = minutesToMS(10);
const rewardDelayAnimationTime = 1000;
export function Game({state = createState(), seed = Date.now()}) {
  const [gameState, setGameState] = useState({
    ...state,
    seed: seed,
    timeSinceEpochMS: Date.now(),
    startTime: Date.now(),
  });
  //TODO refractor previous with usePrevious for all properties not needed to be used by reducer
  const [
    isInititialRewardAnimationComplete,
    setIsRewardAnimationComplete,
  ] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  function dispatch(event) {
    setGameState((gameState) => reduceGameState(gameState, event));
  }

  const isTimerRunning = true;
  useInterval(
    () => {
      dispatch({
        type: "HANDLE_UNRELIABLE_TIME_TICK",
        timeSinceEpochMS: Date.now(),
        timeFunctionDictionary: {
          incrementProgress,
          changeRandomReward,
          doNothing,
        },
      });
    },
    isTimerRunning ? gameState.millisecondsPerTick : null,
  );

  const saveEverySecondEffect = () => {
    const timer = setInterval(() => {
      // saveState({storageSettings: stateStorageSettings, value: gameState});
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  };
  const startEffect = () => {
    dispatch({
      type: "SET_VARIABLE",
      property: "isFocusModeEnabled",
      value: true,
    });
    dispatch({
      type: "GIVE_RANDOM_OPENING_REWARD",
    });
  };

  const isTimeToGiveReward = getIsTimeToGiveOpeningRewardWithCoolDown({
    gameState: gameState,
    coolDownTimeMS: coolDownTimeMS,
  });
  if (isTimeToGiveReward && isVisible) {
    dispatch({
      type: "GIVE_RANDOM_OPENING_REWARD",
    });
    dispatch({
      type: "HANDLE_UNRELIABLE_TIME_TICK",
      //This should not cause an infinite loop because timeSinceEpoch changes every MS
      timeSinceEpochMS: Date.now() + 1,
      timeFunctionDictionary: {
        incrementProgress,
        changeRandomReward,
        doNothing,
      },
    });
  }
  useEffect(startEffect, []);
  // useEffect(saveEverySecondEffect, []);
  // if (isPending) return "Loading...";
  //TODO replace with use previous
  const allComputedProperties = getComputedProperties(gameState);

  const {
    totalPoints,
    pointsRemaining,
    hasRecentlyWon,
    lastReward,
  } = allComputedProperties;

  const [shouldRelease, setShouldRelease] = useState(false);

  return (
    <>
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
            !gameState.isWaitingForReward
          }
        />
        <PointCalculationAnimation gameState={gameState} dispatch={dispatch} />

        <PointsShop
          gameState={gameState}
          dispatch={dispatch}
          //TODO move animation
          shouldShowPoints={
            isInititialRewardAnimationComplete && !gameState.isWaitingForReward
          }
        />
        <GainPointsUserActions gameState={gameState} dispatch={dispatch} />
        <MaybeRewardForOpening
          gameState={gameState}
          coolDownTimeMS={coolDownTimeMS}
          rewardAmount={gameState.userActionPoints}
          onRewardShown={() => {
            setIsRewardAnimationComplete(true);
          }}
        />
      </GameWrapper>
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
        <ActionProgress />
        <UserOneTimeActions
          actionList={actionNames}
          valueList={actionValues}
          onComplete={(itemSelected) => {
            const userActionValue = getUserOneTimeActionValue({
              state: gameState,
              itemName: itemSelected,
            });

            dispatch(
              changeUserPointsAction(
                gameState.userActionPoints + userActionValue,
              ),
            );
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
