/*global jest*/
import {range, times} from "lodash";
import produce from "immer";

import {
  createIntervalEvent,
  createOneTimeEvent,
  createTimerState,
  getSkippedTicks,
  timeReducer,
} from "./time-reducer";

describe("Time events ", () => {
  test("run multiple times ", () => {
    const runEvent = jest.fn((state) => state);
    let state = createTimerState();

    state = timeReducer(state, {
      type: "ADD_INTERVAL_EVENT",
      intervalEvent: createIntervalEvent({
        intervalMilliseconds: 1,
        functionName: "runEvent",
      }),
    });

    let newState = state;

    times(
      5,
      () =>
        (newState = produce(newState, (state) =>
          timeReducer(state, {
            type: "HANDLE_TIME_TICK",
            timeFunctionDictionary: {runEvent},
          }),
        )),
    );
    expect(runEvent).toHaveBeenCalledTimes(5);
  });
  test("simulate skipped ticks", () => {
    const runEvent = jest.fn((state) => state);
    let state = {
      ...createTimerState({intervalMilliseconds: 1, functionName: () => {}}),
      timeSinceEpochMS: 0,
      millisecondsPerTick: 1,
    };

    state = timeReducer(state, {
      type: "ADD_INTERVAL_EVENT",
      intervalEvent: createIntervalEvent({
        intervalMilliseconds: 1,
        functionName: "runEvent",
      }),
    });

    let newState = state;

    newState = produce(newState, (state) =>
      timeReducer(state, {
        type: "HANDLE_SKIPPED_TICKS",
        timeSinceEpochMS: 5,
        timeFunctionDictionary: {runEvent},
      }),
    );
    expect(runEvent).toHaveBeenCalledTimes(4);
  });

  test("run unreliable timer once", () => {
    const runEvent = jest.fn((state) => state);
    let state = {
      ...createTimerState({intervalMilliseconds: 1, functionName: () => {}}),
      timeSinceEpochMS: 0,
      millisecondsPerTick: 5,
    };

    state = timeReducer(state, {
      type: "ADD_INTERVAL_EVENT",
      intervalEvent: createIntervalEvent({
        intervalMilliseconds: 5,
        functionName: "runEvent",
      }),
    });

    let newState = state;

    newState = produce(newState, (state) =>
      timeReducer(state, {
        type: "HANDLE_UNRELIABLE_TIME_TICK",
        timeSinceEpochMS: 5,
        timeFunctionDictionary: {runEvent},
      }),
    );
    expect(runEvent).toHaveBeenCalledTimes(1);
  });

  test("run timer with simulated skipped ticks", () => {
    const runEvent = jest.fn((state) => state);
    let state = {
      ...createTimerState({intervalMilliseconds: 1, functionName: () => {}}),
      timeSinceEpochMS: 0,
      millisecondsPerTick: 1,
    };

    state = timeReducer(state, {
      type: "ADD_INTERVAL_EVENT",
      intervalEvent: createIntervalEvent({
        intervalMilliseconds: 1,
        functionName: "runEvent",
      }),
    });

    let newState = state;

    newState = produce(newState, (state) =>
      timeReducer(state, {
        type: "HANDLE_UNRELIABLE_TIME_TICK",
        timeSinceEpochMS: 5,
        timeFunctionDictionary: {runEvent},
      }),
    );
    expect(runEvent).toHaveBeenCalledTimes(5);
  });

  test("change interval", () => {
    const runEvent = jest.fn((state) => state);
    const id = "eventId";

    let state = createTimerState();
    state = {
      ...state,
      millisecondsPassed: 0,
      progressAmount: 5,
      millisecondsPerTick: 50,
      incrementAmount: 0.1,
      isVisible: true,
      intervalEvents: [],
    };

    state = timeReducer(state, {
      type: "ADD_INTERVAL_EVENT",
      intervalEvent: createIntervalEvent({
        id: id,
        intervalMilliseconds: 100,
        functionName: "runEvent",
      }),
    });

    let stateThatFiresEvent = produce(state, (state) =>
      timeReducer(state, {
        type: "SET_EVENT_INTERVAL",
        eventId: id,
        newInterval: 500,
      }),
    );

    times(
      10,
      () =>
        (stateThatFiresEvent = timeReducer(stateThatFiresEvent, {
          type: "HANDLE_TIME_TICK",
          timeFunctionDictionary: {runEvent},
        })),
    );
    expect(runEvent).toHaveBeenCalledTimes(1);
  });

  test("run oneTimeEvent ", () => {
    let state = createTimerState();
    const runEvent = jest.fn((state) => state);

    state = {
      ...state,
      millisecondsPassed: 0,
      millisecondsPerTick: 50,
      isVisible: true,
      oneTimeEvents: [],
      intervalEvents: [],
    };

    state = timeReducer(state, {
      type: "ADD_ONE_TIME_EVENT",
      oneTimeEvent: createOneTimeEvent({
        id: "test",
        runTime: 1000,
        functionName: "runEvent",
      }),
    });

    let stateThatFiresEvent = state;
    expect(state.oneTimeEvents[0].isCompleted).toBe(false);
    times(
      1000,
      () =>
        (stateThatFiresEvent = timeReducer(stateThatFiresEvent, {
          type: "HANDLE_TIME_TICK",
          timeFunctionDictionary: {runEvent},
        })),
    );

    expect(runEvent).toHaveBeenCalledTimes(1);
    expect(stateThatFiresEvent.oneTimeEvents[0].isCompleted).toBe(true);
  });
});
