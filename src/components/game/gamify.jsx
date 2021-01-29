import {useInterval} from "ahooks";
import PageVisibility from "react-page-visibility";
import React, {useState, useEffect} from "react";
import styled from "styled-components";

import {ActionProgress, ProgressView} from "components/game/game-progress";
import {UserOneTimeActions} from "components/game/user-actions";
import {
  changeRandomReward,
  changeUserPointsAction,
  doNothing,
  getComputedProperties,
  getUserOneTimeActionValue,
  getUserOneTimeActions,
  incrementProgress,
  spendAPoint,
} from "components/game/game-tools";
import {createState} from "components/game/game-initializer";
import {pauseGame, reduceGameState, unPauseGame} from "components/game-reducer";
import {resistingSettings} from "components/game/game-settings";
import MaybeRewardForOpening from "components/game/game-reward-for-opening";
import PointsShop from "components/game/points-shop";
import {getIsTimeToGiveOpeningRewardWithCoolDown} from "components/game/game-tools";

const minutesToMS = (minutes) => minutes * 60 * 1000;
const coolDownTimeMS = minutesToMS(10);

export function Game({state = createState(), seed = Date.now()}) {
  const [gameState, setGameState] = useState({
    ...state,
    seed: seed,
    timeSinceEpochMS: Date.now(),
    startTime: Date.now(),
  });
  //TODO refractor previous with usePrevious for all properties not needed to be used by reducer
  const [isRewardAnimationComplete, setIsRewardAnimationComplete] = useState(
    false,
  );
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
  const allComputedProperties = getComputedProperties(gameState);
  const {totalPoints, pointsRemaining} = allComputedProperties;

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
            !allComputedProperties.isWaitingForReward
          }
        />
        <PointsShop
          gameState={gameState}
          dispatch={dispatch}
          shouldShowPoints={isRewardAnimationComplete}
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
const GameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 50px;
  color: #444;

  border: 1px solid #1890ff;
`;
function GainPointsUserActions({gameState, dispatch}) {
  return (
    <>
      <div>
        <h2>Gain Points</h2>
        <ActionProgress />
        <UserOneTimeActions
          actionList={getUserOneTimeActions(gameState)}
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
const HoldTensionBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: #444;
  border: 1px solid red;
`;

const ReleaseTensionBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: #444;
  border: 1px solid blue;
`;
