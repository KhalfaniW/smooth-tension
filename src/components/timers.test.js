import {fireEvent, render} from "@testing-library/react";
import {range} from "lodash";
import React from "react";

import {
  CancelableCountdown,
  MeditationTimer,
  getMeditationMessageFromTime,
} from "./timers";

jest.useFakeTimers();

test("MeditationTimer renders ", () => {
  render(<MeditationTimer />);
});

describe("timer functions ", () => {
  test("create correct start time", () => {
    const originalSeconds = 10;
    for (var i = 0; i < 10; i++) {
      const startTime = originalSeconds + i;
      expect(
        getMeditationMessageFromTime({
          seconds: startTime,
          totalSeconds: startTime,
        }),
      ).toBe(`1 Breath In`);
    }
  });
  test("increment correctly", () => {
    const originalSeconds = 10;
    for (var i = 0; i < 10; i++) {
      const startTime = originalSeconds + i;
      expect(
        getMeditationMessageFromTime({
          seconds: startTime - 1,
          totalSeconds: startTime,
        }),
      ).toBe(`2 Breath In`);
    }
  });

  test("create count up message at start", () => {
    getMeditationMessageFromTime(298);
    const originalSeconds = 10;
    let secondsElapsed = 0;
    let medtitationTimerBreathInTime = [1, 2, 3, 4];
    secondsElapsed = 0;
    medtitationTimerBreathInTime.forEach((time) => {
      expect(
        getMeditationMessageFromTime({
          seconds: originalSeconds - secondsElapsed,
          totalSeconds: originalSeconds,
        }),
      ).toBe(`${time} Breath In`);
      secondsElapsed++;
    });
  });

  test("create count down messages", () => {
    getMeditationMessageFromTime(298);
    const originalSeconds = 10;
    let secondsElapsed = 0;
    let medtitationTimerBreathOutTime = [4, 3, 2, 1];

    secondsElapsed = 4;
    medtitationTimerBreathOutTime.forEach((time) => {
      expect(
        getMeditationMessageFromTime({
          seconds: originalSeconds - secondsElapsed,
          totalSeconds: originalSeconds,
        }),
      ).toBe(`${time} Breath Out`);
      secondsElapsed++;
    });
  });
});

test("Countdown stops ", () => {
  const {getByText, queryByText} = render(
    <CancelableCountdown
      seconds={10}
      renderView={({seconds, cancel}) => {
        return (
          <div>
            <div>{seconds}</div> <button onClick={cancel}>Cancel</button>
          </div>
        );
      }}
    />,
  );
  expect(getByText(/10/i)).not.toBeNull();

  fireEvent.click(getByText("Cancel"));

  expect(queryByText(/10/)).toBeNull();
});
