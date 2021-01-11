/*global jest*/
import {range, times} from "lodash";
import produce from "immer";

import {
  createIntervalEvent,
  createOneTimeEvent,
  timeReducer,
} from "./time-reducer";
import {createGameState} from "./gamelogic";

describe("Time events ", () => {
  test("run multiple times ", () => {
    const runEvent = jest.fn((state) => state);
    let state = createGameState();

    state = timeReducer(state, {
      type: "ADD_INTERVAL_EVENT",
      intervalEvent: createIntervalEvent({
        intervalMilliseconds: 1,
        runEvent: runEvent,
      }),
    });

    let newState = state;

    range(0, 5).forEach(
      () =>
        (newState = produce(newState, (state) =>
          timeReducer(state, {type: "HANDLE_TIME_TICK"}),
        )),
    );
    expect(runEvent).toHaveBeenCalledTimes(5);
  });

  test("change interval", () => {
    const runEvent = jest.fn((state) => state);
    const id = "eventId";

    let state = createGameState();
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
        runEvent: runEvent,
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
        })),
    );
    expect(runEvent).toHaveBeenCalledTimes(1);
  });

  test("run oneTimeEvent ", () => {
    let state = createGameState();
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
        runEvent: runEvent,
      }),
    });

    let stateThatFiresEvent = state;
    expect(state.oneTimeEvents[0].isCompleted).toBe(false);
    times(
      1000,
      () =>
        (stateThatFiresEvent = timeReducer(stateThatFiresEvent, {
          type: "HANDLE_TIME_TICK",
        })),
    );

    expect(runEvent).toHaveBeenCalledTimes(1);
    expect(stateThatFiresEvent.oneTimeEvents[0].isCompleted).toBe(true);
  });
});
