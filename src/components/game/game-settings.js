export const changeSpeed = (value) => value;

export const obtainSettings = () => {
  return {
    probabiltyOfWinPercentDecimal: 0.4,
    animationConfig: {
      minNumberToShow: 1,
      maxNumberToShow: 10,
    },
    userActionsValueDictionary: {
      oneTimeActions: {
        "Close distracting websites: YouTube.com etc": 2,
        "Identify next action": 2 /*make next action specific, easy, able to do now if not break it inot smaller steps*/,

        "Hold Negative motions Breath 10 seconds in 10 seconds out": 1,
        "Do heart rate breathing 10s": 1,
        "Open Scheduler Or Habit App": 0.5,
        "Go to working location": 1,
      },
      physicalState: {
        "Sit in active position": changeSpeed(0.5),
        "Do breathing exercise": changeSpeed(1.5),
        "Relax body | No shaking": changeSpeed(0.5),
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
      "Breath Exersie": changeSpeed(1),
    },
  },
};
