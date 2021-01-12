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
      "Start 5 minute exercise": giveFixedPoints(0.5),
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
