import {Spring} from "react-spring/renderprops";
import NumberFormat from "react-number-format";
import React, {useEffect, useState} from "react";

import {getComputedProperties} from "components/game/game-tools";
import {getRandomBoolean} from "components/random-reducer";
import {getWinOrLossMeaningConfig} from "components/game/animation-tools";

export const PointAnimationDisplayBox = ({children}) => (
  <div className="border h-40 w-60">{children}</div>
);
export default function PointCalculationAnimation({gameState, dispatch}) {
  const {hasRecentlyWon} = getComputedProperties(gameState);
  const keyForResettingAnimation = gameState.pointAnimationCount;
  return (
    <>
      <PointAnimationDisplayBox>
        {gameState.pointAnimationCount > 0 ? (
          <PointCalculationAnimationView
            isWin={hasRecentlyWon}
            isCloseLoss={
              getRandomBoolean({
                probabilityOfTrue: 0.4,
                seed: gameState.seed,
              }) && !hasRecentlyWon
            }
            seed={gameState.seed}
            key={keyForResettingAnimation}
            animationConfig={gameState.currentSettings.animationConfig}
            onAnimationStart={() => {}}
            onAnimationEnd={() => {
              dispatch({type: "END_WAITING_FOR_REWARD"});
            }}
            onFinishedShowing={() => {
              dispatch({type: "END_WAITING_TO_HIDE_REWARD_CREATOR"});
            }}
          />
        ) : null}
      </PointAnimationDisplayBox>
    </>
  );
}

function PointCalculationAnimationView({
  isWin,
  isCloseLoss,
  seed,
  animationConfig,
  delayAfterLoading = 1500,
  onAnimationStart = () => {},
  onAnimationEnd = () => {},
  onFinishedShowing = () => {},
}) {
  useEffect(() => {
    onAnimationStart();
    return () => {};
  }, [onAnimationStart]);

  function handleAnimationEnd() {
    onAnimationEnd();
    setTimeout(() => {
      onFinishedShowing();
    }, delayAfterLoading);
  }

  return (
    <>
      <RandomRewardAnimation
        seed={seed}
        isWin={isWin}
        isCloseLoss={isCloseLoss}
        onAnimationEnd={handleAnimationEnd}
        maxNumberToShow={animationConfig.maxNumberToShow}
        minNumberToShow={animationConfig.minNumberToShow}
      />
    </>
  );
}
const animationPercentEnd = 100,
  animationPercentStart = 0,
  animationPercentTotal = animationPercentEnd - animationPercentStart,
  animationPercentStep = 0.1;

function RandomRewardAnimation({
  isWin,
  seed,
  onAnimationEnd,
  maxNumberToShow,
  minNumberToShow,
  isCloseLoss,
}) {
  const [isFinished, setIsFinished] = useState(false);

  const {
    getIsNumberAWinningNumber,
    getNumberToShowFromPercentComplete,
    winningNumberMessage,
    losingNumberMessage,
  } = getWinOrLossMeaningConfig({
    minNumber: minNumberToShow,
    maxNumber: maxNumberToShow,
    isWin: isWin,
    isCloseLoss,
    animationPercentStep,
    seed,
  });

  function handleRest() {
    if (!isFinished) {
      onAnimationEnd();
      // only run onRest once
      setIsFinished(true);
    }
  }
  return (
    <>
      <Spring
        from={{number: animationPercentStart}} //change to 0
        to={{number: animationPercentEnd}}
        onRest={handleRest}
        config={{friction: 25, tension: 35, clamp: true}}
      >
        {(props) => {
          // if you take more decimals than 1 it will jump around too quickly
          const percentComplete = Number(props.number.toFixed(1));
          const numberToShow = getNumberToShowFromPercentComplete({
            seed: seed,
            percentComplete: percentComplete,
          });

          return (
            <>
              <RandomNumberView
                number={numberToShow}
                percentComplete={percentComplete}
                isNumberAWin={getIsNumberAWinningNumber(numberToShow)}
              />
              <RandomNumberSpinProgressView percentComplete={percentComplete} />
            </>
          );
        }}
      </Spring>
      {isFinished ? (isWin ? winningNumberMessage : losingNumberMessage) : null}
    </>
  );
}

function RandomNumberView({number, isNumberAWin, percentComplete}) {
  const isCloseToEnd = percentComplete > 97;
  const numberAsString = number.toString();
  const numberToShow = number < 10 ? "0" + numberAsString : numberAsString;

  return (
    <div className="border m-4 rounded">
      {isCloseToEnd ? (
        isNumberAWin ? (
          <div className="bg-green-300 rounded">{numberToShow}</div>
        ) : (
          <div className="bg-red-300 rounded">{numberToShow}</div>
        )
      ) : (
        <div className="rounded">{numberToShow}</div>
      )}
    </div>
  );
}

function RandomNumberSpinProgressView({percentComplete}) {
  return (
    <div>
      <div className="w-full h-5 overflow-hidden rounded-lg bg-gray-300">
        <div
          className="h-full  bg-blue-400"
          style={{width: `${percentComplete}%`}}
        ></div>
      </div>
      {
        <NumberFormat
          value={percentComplete}
          displayType={"text"}
        ></NumberFormat>
      }
      / 100
    </div>
  );
}
