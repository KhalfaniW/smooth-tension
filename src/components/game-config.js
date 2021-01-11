export const changeSpeed = (value) => value;
export const giveFixedPoints = (value) => value;

export const userActionsValueDictionary = {
  oneTimeActions: {
    "Close distracting websites: YouTube.com etc": giveFixedPoints(0.5),
    "Do Mindfulness survey": giveFixedPoints(2),
    "Start 2 minute exercise": giveFixedPoints(0.2),
    "Start 5 minute exercise": giveFixedPoints(0.5),
    "Start 15 minute exercise": giveFixedPoints(2.2),
  },
  physicalState: {
    "Sit in active position": changeSpeed(1),
    "Do breathing exercise": changeSpeed(1),
    "Relax body | no shaking": changeSpeed(0.5),
  },
};
