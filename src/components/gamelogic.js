import produce from "immer"; //aciton = type || type+payload
export function reduceGameState(state, action) {
  return produce(state, (draftState) => {
    switch (action.type) {
      case "HANDLE_TIME_TICK":
        let newState = produce(state, (draftState) => {
          draftState.millisecondsPassed += draftState.millisecondsPerTick;
        });

        for (var i = 0; i < draftState.timeIntervalEvents.length; i++) {
          newState = runIntervalEventIfScheduled(newState, i);
        }
        return newState;
      case "SET_PROGRESS_INCREMENT_SPEED":
        let newState2 = produce(state, (draftState) => {
          draftState.speedMultiplier = action.speedMultiplier;
        });

        const newInterval =
          state.defaultIncrementInterval / action.speedMultiplier;

        return reduceGameState(newState2, {
          type: "SET_EVENT_INTERVAL",
          eventId: "UPDATE_PROGRESS_ID",
          newInterval: newInterval,
        });

      case "SET_EVENT_INTERVAL":
        const index = draftState.timeIntervalEvents.reduce(
          (indexAcc, event, index) => {
            return event.id === action.eventId ? index : indexAcc;
          },
          null,
        );
        draftState.timeIntervalEvents[index].intervalMilliseconds =
          action.newInterval;
        break;
      case "SET_VARIABLE":
        draftState[action.property] = action.value;
        break;
      case "TOGGLE_BOOLEAN":
        draftState[action.property] = !draftState[action.property];
        break;
      default:
        throw new Error(
          `action.type ${action.type} is not handled action = ${JSON.stringify(
            action,
          )}`,
        );
    }
  });
}
export function createGameState() {
  return {
    millisecondsPassed: 0,
    progressAmount: 5,
    millisecondsPerTick: 50,
    incrementAmount: 0.1,
    isVisible: true,
    oneTimeEvents: [],
    timeIntervalEvents: [],
  };
}
export function addEvent(state, timeIntervalEvent) {
  return produce(state, (draftState) => {
    draftState.timeIntervalEvents.push(timeIntervalEvent);
  });
}

export function addOneTimeEvent(state, oneTimeEvent) {
  return produce(state, (draftState) => {
    draftState.oneTimeEvents.push(oneTimeEvent);
  });
}

function runOneTimeEventsIfScheduled(state, oneTimeEventIndex) {
  return produce(state, (draftState) => {
    const oneTimeEvent = state.oneTimeEvents[oneTimeEventIndex];
    if (oneTimeEvent.isCompleted) {
      return state;
    }
    const isTimeToRun = state.millisecondsPassed >= oneTimeEvent.timeToRun;
    if (isTimeToRun) {
      let newState = produce(state, (draftState) => {
        draftState.oneTimeEvents[oneTimeEventIndex].isCompleted = true;
      });

      return oneTimeEvent.runEvent(newState);
    }
  });
}

function runIntervalEventIfScheduled(state, timeIntervalEventIndex) {
  return produce(state, (draftState) => {
    const timeIntervalEvent = state.timeIntervalEvents[timeIntervalEventIndex];
    const nextTimeToIncrement =
      timeIntervalEvent.lastIncrementTime +
      timeIntervalEvent.intervalMilliseconds;

    const isTimeToRun = state.millisecondsPassed >= nextTimeToIncrement;
    if (isTimeToRun) {
      let newState = produce(state, (draftState) => {
        draftState.timeIntervalEvents[
          timeIntervalEventIndex
        ].lastIncrementTime = draftState.millisecondsPassed;
      });

      return timeIntervalEvent.runEvent(newState);
    }
  });
}

export function createEventWithInterval({
  intervalMilliseconds,
  runEvent,
  id = null,
}) {
  return {
    id: id,
    lastIncrementTime: 0,
    intervalMilliseconds: intervalMilliseconds,
    runEvent: runEvent,
  };
}
export function createOneTimeEvent({
  intervalMilliseconds,
  runEvent,
  id = null,
}) {
  return {
    id: id,
    lastIncrementTime: 0,
    intervalMilliseconds: intervalMilliseconds,
    runEvent: runEvent,
    isCompleted: false,
  };
}
