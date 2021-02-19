export const changeSpeed = (value) => value;

export const obtainSettings = () => {
  return {
    spinWinProbability: 0.4,
    openRewardValue: 1,
    openingRewardProbability: 0.5,
    animationConfig: {
      minNumberToShow: 1,
      maxNumberToShow: 18,
    },
    finalAction:
      "Final Action: Hold for 15 more seconds to show you can handle discomfort",
    userActionsValueDictionary: {
      oneTimeActions: {
        "Close distracting websites": 2,
        "Identify next action": 2 /*make next action specific, easy, able to do now if not break it inot smaller steps*/,
        "Remember your values: Why are you doing this?": 1,
      },
    },
  };
};

export const resistingSettings = {
  userActionsValueDictionary: {
    oneTimeActions: {
      "Remember that this feeling will pass": 2,
      "Remember what is important": 0.5,
      "Block site temp": 1,
      "Try waiting for 10 min": 1,
      "Close distracting website": 0.5,
    },
    physicalState: {
      "Breath Exercise": changeSpeed(1),
    },
  },
};
