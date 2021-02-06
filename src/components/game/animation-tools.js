import {Spring} from "react-spring/renderprops";
import NumberFormat from "react-number-format";
import React, {useEffect, useState} from "react";
import * as _ from "lodash";
import {getComputedProperties} from "components/game/game-tools";
import {
  getRandomIntInclusive,
  getRandomNumberGroup,
  getRandomBoolean,
} from "components/random-reducer";

export function getWinOrLossMeaningConfig({
  minNumber,
  maxNumber,
  isWin,
  animationNumberCount,
  animationPercentMax = 100,
  animationPercentMin = 0,
  animationPercentStep = 0.1,
  seed,
}) {
  //group these together because changing 1 must change all

  const halfOfMax = parseInt(maxNumber / 2);
  const winningNumberMessage = `Win: Number greater or equal to ${halfOfMax}`;
  const losingNumberMessage = `Try Again: Number less than ${halfOfMax} `;

  const getIsNumberAWinningNumber = (n) => n >= halfOfMax;

  const getAWinningRandomNumber = (seed) =>
    getRandomIntInclusive({
      max: maxNumber,
      min: halfOfMax,
      seed: seed,
    });
  const getALosingRandomNumber = (seed) =>
    getRandomIntInclusive({
      max: halfOfMax - 1,
      min: minNumber,
      seed: seed,
    });
  const isCloseLoss = getRandomBoolean({
    probabilityOfTrue: 0.4,
    seed: seed,
  });
  const animationPercentTotal = animationPercentMax - animationPercentMin;
  const indexFor0thFrame = 1;
  const totalFrames =
    animationPercentTotal / animationPercentStep + indexFor0thFrame;
  const finalNumbers = getFinalAnimationNumbers({
    minNumberToShow: minNumber,
    maxNumberToShow: maxNumber,
    animationNumberCount: totalFrames,
    isWin,
    isCloseLoss,
    getALosingRandomNumber,
    getAWinningRandomNumber,
    seed: seed,
  });

  const getNumberToShowFromPercentComplete = ({percentComplete, seed}) => {
    // if you take more decimals than 1 it will jump around too quickly
    const currentFrameIndex = parseInt(
      (percentComplete * 100) / animationPercentStep,
    );
    return finalNumbers[currentFrameIndex];
  };

  return {
    winningNumberMessage,
    losingNumberMessage,
    getNumberToShowFromPercentComplete,
    getIsNumberAWinningNumber,
  };
}

export function getFinalAnimationNumbers({
  minNumberToShow,
  maxNumberToShow,
  animationNumberCount,
  isWin,
  isCloseLoss,
  getALosingRandomNumber,
  getAWinningRandomNumber,
  seed,
}) {
  //group these together because changing 1 must change all
  const createArbitraryEntropy = (n) => seed + n;

  const listOfNumbersToUse = getRandomNumberGroup({
      max: maxNumberToShow,
      min: minNumberToShow,
      count: animationNumberCount,
      seed: createArbitraryEntropy(2324),
    }),
    winningNumber = getAWinningRandomNumber(createArbitraryEntropy(888)),
    arrayWithLastWithWinningNumberAtEnd = _.dropRight(
      listOfNumbersToUse,
    ).concat(winningNumber);

  if (isWin) {
    return arrayWithLastWithWinningNumberAtEnd;
  }
  return mapAnimationNumbersToLossType({
    listOfNumbersToUse,
    isCloseLoss,
    winningNumber: winningNumber,
    twoLosingNumbers: [
      getALosingRandomNumber(seed + createArbitraryEntropy(33)),
      getALosingRandomNumber(seed + createArbitraryEntropy(34)),
    ],
  });
}

function mapAnimationNumbersToLossType({
  listOfNumbersToUse,
  isCloseLoss,
  winningNumber,
  twoLosingNumbers,
}) {
  const regularLossNumbers = [twoLosingNumbers[0], twoLosingNumbers[1]];
  const closeLossEndNumbers = [winningNumber, twoLosingNumbers[1]];
  const replaceEndNumbersWith = (newEndNumbers) =>
    _.dropRight(listOfNumbersToUse, newEndNumbers.length).concat(newEndNumbers);

  if (isCloseLoss) {
    return replaceEndNumbersWith(closeLossEndNumbers);
  }
  return replaceEndNumbersWith(regularLossNumbers);
}
