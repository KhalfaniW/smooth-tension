export const changeSpeed = (value) => value;

export const obtainSettings = () => {
  return {
    userActionsValueDictionary: {
      oneTimeActions: {
        "Close distracting websites: YouTube.com etc": 2,
        "Identify next action": 2 /*make it specific, easy, able to do now if not break it inot smaller steps*/,
        "Breath 10 seconds in 10 seconds out": 1,
        "Start 2 minute exercise": 0.2,
        "Do heart rate breathing 10s": 1,
        "Open Scheduler Or Habit App": 0.5,
        "Start 15 minute exercise": 2.2,
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
