/*global jest*/
import {range} from "lodash";
import produce from "immer";

import {
  addEvent,
  createEventWithInterval,
  createGameState,
  reduceGameState,
} from "./gamelogic";

describe("Time events ", () => {
  test("run multiple times ", () => {
    const runEvent = jest.fn((state) => state);
    let state = createGameState();

    state = addEvent(
      state,
      createEventWithInterval({
        intervalMilliseconds: 1,
        runEvent: runEvent,
      }),
    );
    let newState = state;

    range(0, 5).forEach(
      () =>
        (newState = produce(newState, (state) =>
          reduceGameState(state, {type: "HANDLE_TIME_TICK"}),
        )),
    );
    expect(runEvent).toHaveBeenCalledTimes(5);
  });

  test("change interval", () => {
    const runEvent = jest.fn((state) => state);
    const id = "eventId";

    let state = {
      millisecondsPassed: 0,
      progressAmount: 5,
      millisecondsPerTick: 50,
      incrementAmount: 0.1,
      isVisible: true,
      timeIntervalEvents: [],
    };

    state = addEvent(
      state,
      createEventWithInterval({
        id: id,
        intervalMilliseconds: 100,
        runEvent: runEvent,
      }),
    );
    let stateWithNewInterval = produce(state, (state) =>
      reduceGameState(state, {
        type: "SET_EVENT_INTERVAL",
        eventId: id,
        newInterval: 500,
      }),
    );

    range(0, 10).forEach(
      () =>
        (stateWithNewInterval = reduceGameState(stateWithNewInterval, {
          type: "HANDLE_TIME_TICK",
        })),
    );
    expect(runEvent).toHaveBeenCalledTimes(1);
  });
});
