import produce from "immer";
import {times} from "lodash";

export function timeReducer(state, action) {
  //immer drafts must be copied because they cannot be reassigned

  return produce(state, (draftState) => {
    let newState = produce(state, (draftState) => {
      return draftState;
    });

    switch (action.type) {
      case "HANDLE_UNRELIABLE_TIME_TICK":
        //setInterval ticks may be skipped some times

        newState = timeReducer(newState, {
          type: "HANDLE_SKIPPED_TICKS",
          timeSinceEpochMS: action.timeSinceEpochMS,
          timeFunctionDictionary: action.timeFunctionDictionary,
        });

        if (
          action.timeSinceEpochMS - state.timeSinceEpochMS >=
          state.millisecondsPerTick
        ) {
          newState = timeReducer(newState, {
            type: "HANDLE_TIME_TICK",
            timeSinceEpochMS: action.timeSinceEpochMS,
            timeFunctionDictionary: action.timeFunctionDictionary,
          });
        }
        // newState = produce(state, (draftState) => {
        //   draftState.millisecondsPassed =
        //     action.timeSinceEpochMS - state.startTime;
        // });

        return newState;
      case "HANDLE_TIME_TICK":
        newState = produce(state, (draftState) => {
          draftState.millisecondsPassed += draftState.millisecondsPerTick;
        });
        const timeFunctionDictionary = action.timeFunctionDictionary;
        for (var i = 0; i < draftState.intervalEvents.length; i++) {
          newState = runIntervalEventIfScheduled(
            newState,
            timeFunctionDictionary,
            i,
          );
        }
        //TODO Change to object params
        for (i = 0; i < draftState.oneTimeEvents.length; i++) {
          newState = runOneTimeEventIfScheduled(
            newState,
            timeFunctionDictionary,
            i,
          );
        }
        return newState;
      case "HANDLE_SKIPPED_TICKS":
        //run skpped ticks but not final/current

        newState = produce(state, (draftState) => {
          draftState.timeSinceEpochMS = action.timeSinceEpochMS;
        });
        const extraTicksNeeded = getExtraTicksNeeded({
          realTime: action.timeSinceEpochMS,
          timerState: state,
        });

        for (i = 0; i < extraTicksNeeded; i++) {
          newState = timeReducer(newState, {
            type: "HANDLE_TIME_TICK",
            timeFunctionDictionary: action.timeFunctionDictionary,
          });
        }

        return newState;

      case "SET_EVENT_INTERVAL":
        const index = draftState.intervalEvents.reduce(
          (indexAcc, event, index) => {
            return event.id === action.eventId ? index : indexAcc;
          },
          null,
        );
        draftState.intervalEvents[index].intervalMilliseconds =
          action.newInterval;
        break;
      case "ADD_INTERVAL_EVENT":
        draftState.intervalEvents.push(action.intervalEvent);
        break;
      case "ADD_ONE_TIME_EVENT":
        draftState.oneTimeEvents.push(action.oneTimeEvent);
        break;

      default:
        return state;
    }
  });
}
export function createTimerState() {
  return {
    millisecondsPassed: 0,
    //keep millisecondsPerTick high or mobile performance will suffer
    millisecondsPerTick: 1000,
    oneTimeEvents: [],
    intervalEvents: [],
    timeSinceEpochMS: 0,
    startTime: 0,
    previousTimeSinceEpochMS: 0,
  };
}
export function getPendingEvents(state) {
  return state.oneTimeEvents.filter((event) => {
    return !event.isCompleted;
  });
}
export function getIsEventPending({state, id}) {
  return getPendingEvents(state).some((event) => event.id === id);
}

export function getExtraTicksNeeded({realTime, timerState}) {
  const ticksNeeded = getTicksNeededToFixTimePassed({
    realTime: realTime,
    tickInterval: timerState.millisecondsPerTick,
    startTime: timerState.startTime,
    expectedTimePassed: timerState.millisecondsPassed,
  });
  return Math.max(ticksNeeded, 0);
}
function getTicksNeededToFixTimePassed({
  realTime,
  tickInterval,
  startTime,
  expectedTimePassed,
}) {
  if (tickInterval === 0) {
    throw Error("tick interval must be greater than 0");
  }
  const realTimePassed = realTime - startTime;
  const incorrectTimeDifference = realTimePassed - expectedTimePassed;
  const totalTicksNeeded = Math.floor(incorrectTimeDifference / tickInterval);

  const defaultTickCount = 1;
  const extraTicksNeeded = totalTicksNeeded - defaultTickCount;

  return extraTicksNeeded;
}

function runOneTimeEventIfScheduled(
  state,
  timeFunctionDictionary,
  oneTimeEventIndex,
) {
  return produce(state, (draftState) => {
    const oneTimeEvent = state.oneTimeEvents[oneTimeEventIndex];
    if (oneTimeEvent.isCompleted) {
      return state;
    }

    const isTimeToRun = state.millisecondsPassed >= oneTimeEvent.runTime;
    if (isTimeToRun) {
      let newState = produce(state, (draftState) => {
        draftState.oneTimeEvents[oneTimeEventIndex].isCompleted = true;
      });
      //TODO Rename runevent :quick:
      const eventFunction = timeFunctionDictionary[oneTimeEvent.functionName];
      return eventFunction(newState);
    }
  });
}

function runIntervalEventIfScheduled(
  state,
  timeFunctionDictionary,
  timeIntervalEventIndex,
) {
  return produce(state, (draftState) => {
    const intervalEvent = state.intervalEvents[timeIntervalEventIndex];
    const nextTimeToIncrement =
      intervalEvent.lastIncrementTime + intervalEvent.intervalMilliseconds;

    const isTimeToRun = state.millisecondsPassed >= nextTimeToIncrement;
    if (isTimeToRun) {
      let newState = produce(state, (draftState) => {
        draftState.intervalEvents[timeIntervalEventIndex].lastIncrementTime =
          draftState.millisecondsPassed;
      });
      const eventFunction = timeFunctionDictionary[intervalEvent.functionName];
      return eventFunction(newState);
    }
  });
}
//NOTE Function names are stored insteaf of lambdas to allow for persistance
// functions are sent in a dictionary on time tick
export function createIntervalEvent({
  intervalMilliseconds,
  functionName,
  id = null,
}) {
  return {
    id: id,
    lastIncrementTime: 0,
    intervalMilliseconds: intervalMilliseconds,
    functionName: functionName,
  };
}
export function createOneTimeEvent({runTime, functionName, id = null}) {
  return {
    id: id,
    runTime: runTime,
    functionName: functionName,
    isCompleted: false,
  };
}
