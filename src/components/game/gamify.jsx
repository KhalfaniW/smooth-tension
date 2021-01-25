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

import RewardForOpening from "components/game/game-reward-for-opening";

import {createState} from "components/game/game-initializer";
import {pauseGame, reduceGameState, unPauseGame} from "components/game-reducer";
import {resistingSettings} from "components/game/game-settings";
import PointsShop from "components/game/points-shop";

export function Game({state = createState(), seed = Date.now()}) {
  const [gameState, setGameState] = useState({
    ...state,
    seed: seed,
    timeSinceEpochMS: Date.now(),
    startTime: Date.now(),
  });
  //TODO make it random every time it opens on cooldown
  const shouldShowRewardForOpeningApp = true;
  function dispatch(event) {
    setGameState((gameState) => reduceGameState(gameState, event));
  }
  const setupTimeEffect = () => {
    const timer = setInterval(() => {
      dispatch({
        type: "HANDLE_UNRELIABLE_TIME_TICK",
        timeSinceEpochMS: Date.now(),
        timeFunctionDictionary: {
          incrementProgress,
          changeRandomReward,
          doNothing,
        },
      });
    }, gameState.millisecondsPerTick);

    return () => {
      clearInterval(timer);
    };
  };

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
  };

  useEffect(setupTimeEffect, [gameState.millisecondsPerTick]);
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
      {shouldShowRewardForOpeningApp ? (
        <RewardForOpening gameState={gameState} />
      ) : null}
      <div>
        {totalPoints > 0 ? `Points ${pointsRemaining}/${totalPoints}` : null}{" "}
      </div>
      <PointsShop
        {...{
          ...gameState,
          ...allComputedProperties,
          dispatch: dispatch,
          onSpendAPoint: () => {
            spendAPoint({dispatch: dispatch, gameState: gameState});
          },
        }}
      />
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
