import {Spring} from "react-spring/renderprops";
import NumberFormat from "react-number-format";
import React, {useEffect, useState} from "react";

import {getComputedProperties} from "components/game/game-tools";
import {getRandomIntInclusive} from "components/random-reducer";

export default function PointCalculationAnimation({gameState, dispatch}) {
  const {hasRecentlyWon, lastReward} = getComputedProperties(gameState);

  return (
    <>
      {gameState.isWaitingForReward ||
      gameState.isWaitingToHideRewardCreator ? (
        <PointCalculationAnimationView
          isWin={hasRecentlyWon}
          seed={gameState.seed}
          onAnimationStart={() => {}}
          onAnimationEnd={() => {
            dispatch({type: "END_WAITING_FOR_REWARD"});
          }}
          onFinishedShowing={() => {
            dispatch({type: "END_WAITING_TO_HIDE_REWARD_CREATOR"});
          }}
        />
      ) : null}
    </>
  );
}

function RandomRewardAnimation({isWin, seed, onAnimationEnd}) {
  const [isFinished, setIsFinished] = useState(false);
  function handleRest() {
    if (!isFinished) {
      onAnimationEnd();
      // only run onRest once
      setIsFinished(true);
    }
  }

  const finalRandomNumber = getRandomIntInclusive({
    max: 99,
    min: 1,
    seed: seed,
  });

  const makeEven = (n) => (n % 2 === 0 ? n : n + 1);
  const makeOdd = (n) => makeEven(n) - 1;
  const finalNumber = isWin
    ? makeEven(finalRandomNumber)
    : makeOdd(finalRandomNumber);

  const getRandomNumberView = ({number, isNumberAWin}) => {
    return (
      <div className="border m-4 rounded">
        {isNumberAWin ? (
          <div className="bg-green-300 rounded">{number}</div>
        ) : (
          <div className="bg-red-300 rounded">{number}</div>
        )}
      </div>
    );
  };
  return (
    <>
      <Spring
        from={{number: 0}} //change to 0
        to={{number: 100}}
        onRest={handleRest}
        config={{friction: 25, tension: 35, clamp: true}}
      >
        {(props) => {
          const percentComplete = Number(props.number.toFixed(1));
          const isCloseToEnd = percentComplete > 97;
          const numberToShow =
            percentComplete === 100
              ? finalNumber
              : getRandomIntInclusive({
                  max: 100,
                  min: 10, //min 0 to maintain equal spacig
                  // if you take more decimals it jump around too quickly
                  seed: percentComplete + seed,
                });

          return (
            <>
              {isCloseToEnd ? (
                getRandomNumberView({
                  number: numberToShow,
                  isNumberAWin: numberToShow % 2 === 0,
                })
              ) : (
                <div>{numberToShow}</div>
              )}
              <div>
                {
                  <NumberFormat
                    value={percentComplete}
                    displayType={"text"}
                  ></NumberFormat>
                }
                / 100
              </div>
            </>
          );
        }}
      </Spring>
    </>
  );
}
function RandomNumberRollView({number}) {}

function PointCalculationAnimationView({
  isWin = true,
  seed = 93,
  delayAfterLoading = 1500,
  onAnimationStart = () => {},
  onAnimationEnd = () => {},
  onFinishedShowing = () => {},
}) {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  useEffect(() => {
    onAnimationStart();
    return () => {};
  }, []);

  function handleAnimationEnd() {
    onAnimationEnd();
    setIsAnimationComplete(true);
    setTimeout(() => {
      onFinishedShowing();
    }, delayAfterLoading);
  }

  return (
    <>
      <>
        <RandomRewardAnimation
          seed={seed}
          isWin={isWin}
          onAnimationEnd={handleAnimationEnd}
        />
      </>

      {isAnimationComplete ? isWin ? <>Win</> : <>Try again</> : null}
    </>
  );
}
