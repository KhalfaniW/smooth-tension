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

  const [
    isMaybeRewardShownForOpeningApp,
    setIsMaybeRewardShownForOpeningApp,
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
  const allComputedProperties = getComputedProperties(gameState);
  const {totalPoints, pointsRemaining} = allComputedProperties;

  return (
    <GameWrapper
      onMouseEnter={() => {
        dispatch(unPauseGame());
      }}
      onMouseLeave={() => {
        dispatch(pauseGame());
      }}
    >
      <PageVisibility
        onChange={(isVisible1) => {
          const pauseOrUnpauseGame = isVisible1 ? unPauseGame() : pauseGame();
          dispatch(pauseOrUnpauseGame);
          setIsVisible(isVisible1);
        }}
      ></PageVisibility>

      <StorageControls />

      <button
        onClick={() => {
          dispatch({
            type: "SET_VARIABLE",
            property: "isFocusModeEnabled",
            value: true,
          });
        }}
      >
        Start
      </button>
      <button
        onClick={() => {
          dispatch({
            type: "SET_OBJECT",
            property: "currentSettings",
            value: resistingSettings,
          });
        }}
      >
        Tempted
      </button>

      <ActionProgress />
      <ProgressView
        gameState={gameState}
        progressAmount={gameState.progressAmount}
      />
      <button
        onClick={() => {
          alert(JSON.stringify(gameState));
        }}
      >
        show
      </button>
      <div>
        Block
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
      <MaybeRewardForOpening
        gameState={gameState}
        coolDownTimeMS={coolDownTimeMS}
        rewardAmount={gameState.userActionPoints}
        onRewardShown={() => {
          setIsMaybeRewardShownForOpeningApp(true);
        }}
      />

      <div>
        {isMaybeRewardShownForOpeningApp
          ? `Points ${pointsRemaining}/${totalPoints}`
          : null}
      </div>

      <PricesOfUpgrades />
      <PointsShop gameState={gameState} dispatch={dispatch} />
    </GameWrapper>
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
function PricesOfUpgrades({prices = {item: 0}}) {
  return (
    <>
      <table>
        <tr>
          <th>Item</th>
          <th>Cost</th>
        </tr>
        <tr>
          <td>January</td>
          <td>$100</td>
        </tr>
        <tr>
          <td>February</td>
          <td>$80</td>
        </tr>
      </table>
    </>
  );
}
function StorageControls() {
  return (
    <>
      <button
        onClick={() => {
          /* saveState({storageSettings: stateStorageSettings, value: gameState}); */
        }}
      >
        Save
      </button>
      <br /> <br /> <br />
      <button
        onClick={() => {
          /* retrieveStoredState({ */
          /*   storageSettings: stateStorageSettings, */
          /*   defaultValue: createState(), */
          /* }) */
          /*   .then((retreivedState) => retreivedState) */
          /*   .then((retreivedState) => setGameState(JSON.parse(retreivedState))); */
        }}
      >
        Load
      </button>
    </>
  );
}
