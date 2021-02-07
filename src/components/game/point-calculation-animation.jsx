import {Spring} from "react-spring/renderprops";
import NumberFormat from "react-number-format";
import React, {useEffect, useState} from "react";
import {range} from "lodash";
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
          const percentComplete = Number(props.number.toFixed(1)) / 100;
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
              <RandomNumberSpinProgressView
                previousPercentComplete={
                  percentComplete - 0.001 < 0 ? 0 : percentComplete - 0.001
                }
                percentComplete={percentComplete}
              />
            </>
          );
        }}
      </Spring>
      {isFinished ? (isWin ? winningNumberMessage : losingNumberMessage) : null}
    </>
  );
}

function RandomNumberView({number, isNumberAWin, percentComplete}) {
  const percentOutOf100 = percentComplete * 100;
  const isCloseToEnd = percentOutOf100 > 97;
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
function percentToScaledProgress(percentComplete, limit = 0.9) {
  const lowerLimit = 0.99;
  const endBefore = 0.9;

  //TODO generalize this it don't work for any other number
  const scaledProgressToLowerLimit = percentComplete * endBefore;
  const stepsBetween = (1 - lowerLimit) / 0.001;
  let percentCompleteToShow;
  if (percentComplete < lowerLimit) {
    percentCompleteToShow = scaledProgressToLowerLimit;
  } else {
    const distanceBetween = 1 - percentComplete;
    percentCompleteToShow = 1 - distanceBetween * stepsBetween;
  }

  return percentCompleteToShow;
}
function RandomNumberSpinProgressView({
  previousPercentComplete,
  percentComplete,
}) {
  //TODO extract this logic
  function getPercentToShow({currentPercent, shownMax, distance}) {
    const realPercentToShownPercent = ({distance, currentPercent, maxToShow}) =>
      distance * (currentPercent / maxToShow);

    const config = {
      currentPercent,
      distance: distance,
      maxToShow: shownMax,
    };
    console.log({
      currentPercent,
      distance: distance,
      maxToShow: shownMax,
      x: currentPercent / shownMax,
      shown: realPercentToShownPercent(config),
      ...config,
    });

    return realPercentToShownPercent(config);
  }
  let newValue = 0;
  if (percentComplete <= 0.99) {
    newValue = getPercentToShow({
      currentPercent: percentComplete,
      shownMax: 0.9,
      distance: 0.5,
    });
  } else {
    const distance = 0.5;
    const percentDistanceleft = 1 - (1 - percentComplete) / (1 - 0.99);
    newValue = distance * percentDistanceleft + 0.5;
  }

  //  const newValue = percentToScaledProgress(percentComplete);

  return (
    <div>
      <div className="w-full h-5 overflow-hidden rounded-lg bg-gray-300">
        <div
          className="h-full  bg-blue-400"
          style={{width: `${newValue * 100}%`}}
        ></div>
      </div>
      {
        <NumberFormat
          value={percentComplete * 100}
          displayType={"text"}
        ></NumberFormat>
      }
      / 100
    </div>
  );
}
const _ = require("lodash");
