export const changeSpeed = (value) => value;
export const giveFixedPoints = (value) => value;

export const settings = {
  userActionsValueDictionary: {
    oneTimeActions: {
      "Close distracting websites: YouTube.com etc": giveFixedPoints(0.5),
      "Identify next action": giveFixedPoints(
        2,
      ) /*make it specific, easy, able to do now if not break it inot smaller steps*/,
      "Start 2 minute exercise": giveFixedPoints(0.2),
      "Do heart rate breathing 10s": giveFixedPoints(1),
      "Open Scheduler Or Habit App": giveFixedPoints(0.5),
      "Start 15 minute exercise": giveFixedPoints(2.2),
      "Go to working location": giveFixedPoints(1),
    },
    physicalState: {
      "Sit in active position": changeSpeed(0.5),
      "Do breathing exercise": changeSpeed(1.5),
      "Relax body | No shaking": changeSpeed(0.5),
    },
  },
};

export const resistingSettings = {
  userActionsValueDictionary: {
    oneTimeActions: {
      "Remember that this feeling will pass": giveFixedPoints(2),
      "Breath 30 seconds": giveFixedPoints(0.2),
      "Remember what is important": giveFixedPoints(0.5),
      "Block site temp": giveFixedPoints(1),
      "Try waiting for 10 min": giveFixedPoints(1),
      "Close distracting website": giveFixedPoints(0.5),
    },
    physicalState: {
      "Breath Exersie": changeSpeed(1),
    },
  },
};
