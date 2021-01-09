import {range} from "lodash";
import Countdown from "react-countdown";
import React, {useState, useRef} from "react";

export function MeditationTimer({
  seconds = 300,
  autoStart = false,
  isColored = false,

  onComplete = () => {},
}) {
  const autoRedirectCountDownRef = useRef(null);
  const timeInMiliseconds = seconds * 1000;
  let hoursLeft, minutesLeft, secondsLeft;
  hoursLeft = Math.floor(timeInMiliseconds / 1000 / 60 / 60);
  minutesLeft = Math.floor(
    (timeInMiliseconds / 1000 / 60 / 60 - hoursLeft) * 60,
  );
  secondsLeft = Math.floor(
    ((timeInMiliseconds / 1000 / 60 / 60 - hoursLeft) * 60 - minutesLeft) * 60,
  );

  let totalSeconds = seconds;

  return (
    <>
      <div>{getFormattedTime(seconds)}</div>
      <ControlledCountdown
        seconds={seconds}
        autoStart={autoStart}
        renderView={({hours, minutes, seconds, start, pause, isRunning}) => {
          let totalRemainingSeconds = seconds + 60 * minutes + 360 * hours;
          const meditationMessage = meditationMessageFromTime({
            seconds: totalRemainingSeconds,
            totalSeconds: totalSeconds,
          });
          const isBreathingout = meditationMessage.includes("Out");

          let meditationIndicator;
          let meditationIndicatorStyle = {};
          if (isColored) {
            if (isBreathingout) {
              meditationIndicatorStyle = {backgroundColor: "blue"};
            } else {
              meditationIndicatorStyle = {backgroundColor: "gray"};
            }
          }
          meditationIndicator = (
            <div style={meditationIndicatorStyle}>{meditationMessage}</div>
          );
          if (totalRemainingSeconds === 0) {
            meditationIndicator = <div>Done</div>;
          }

          return (
            <>
              {meditationIndicator}
              {isRunning ? (
                <button
                  onClick={() => {
                    pause();
                  }}
                >
                  pause
                </button>
              ) : (
                <button
                  onClick={() => {
                    start();
                  }}
                >
                  Start
                </button>
              )}
            </>
          );
        }}
      />
    </>
  );
}
function getFormattedTime(timeInSeconds) {
  let timeInMiliseconds = timeInSeconds * 1000;
  let hoursLeft, minutesLeft, secondsLeft;
  hoursLeft = Math.floor(timeInMiliseconds / 1000 / 60 / 60);
  minutesLeft = Math.floor(
    (timeInMiliseconds / 1000 / 60 / 60 - hoursLeft) * 60,
  );
  secondsLeft = Math.floor(
    ((timeInMiliseconds / 1000 / 60 / 60 - hoursLeft) * 60 - minutesLeft) * 60,
  );
  const secondsFormated = `${secondsLeft < 10 ? "0" : ""}${secondsLeft}s`;
  const minutesFormated = `${minutesLeft < 10 ? "0" : ""}${minutesLeft}`;
  const hoursFormated = `${hoursLeft < 10 ? "0" : ""}${hoursLeft}`;
  let formattedTime = minutesFormated + ":" + secondsFormated;

  if (hoursLeft > 0) {
    formattedTime += ":" + hoursFormated;
  }
  return formattedTime;
}
export function ProdcutivityTimer({seconds, onComplete = () => {}}) {
  return (
    <>
      <div>
        <ControlledCountdown
          seconds={seconds}
          onComplete={onComplete}
          renderView={({
            hours,
            minutes,
            seconds,
            start,
            pause,
            reset,
            isRunning,
          }) => {
            const totalRemainingSeconds = hours * 360 + minutes * 60 + seconds;
            let formattedTime = getFormattedTime(totalRemainingSeconds);
            return (
              <>
                {formattedTime}
                {isRunning ? (
                  <button
                    onClick={() => {
                      pause();
                    }}
                  >
                    pause
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      start();
                    }}
                  >
                    Start
                  </button>
                )}

                <button
                  onClick={() => {
                    reset();
                  }}
                >
                  Reset
                </button>
              </>
            );
          }}
        />
      </div>
    </>
  );
}

export function meditationMessageFromTime({seconds, totalSeconds}) {
  const totalSecondsForCycle = 8;
  let elapsedTime = totalSeconds - seconds;
  const index = elapsedTime % totalSecondsForCycle;

  return getMeditationMessages({
    countUpStart: 1,
    countUpEnd: 4,
    countDownStart: 4,
    countDownEnd: 1,
  })[index];
}
function getMeditationMessages({
  countUpStart = 1,
  countUpEnd = 4,
  countDownStart = 4,
  countDownEnd = 1,
}) {
  const breathInTimes = range(countUpStart, countUpEnd + 1).map((index) => {
    return `${index} Breath In`;
  });
  const breathOutTimes = range(countDownStart, countDownEnd - 1).map(
    (index) => {
      return `${index} Breath Out`;
    },
  );

  return breathInTimes.concat(breathOutTimes);
}
//TODO COMBINE PAUSABLE WITH CONTROLLED
export function ControlledCountdown({
  seconds,
  renderView = ({seconds}) => {
    return seconds;
  },
  autoStart = false,
  onPause = () => {},
  onComplete = () => {},
}) {
  const autoRedirectCountDownRef = useRef(null);
  const [keyForResetting, setKeyForResetting] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);

  function getSecondsInFuture(seconds) {
    return Date.now() + seconds * 1000;
  }
  function pause() {
    autoRedirectCountDownRef.current.getApi().pause();
    onPause();
    setIsRunning(false);
  }
  function start() {
    autoRedirectCountDownRef.current.getApi().start();
    setIsRunning(true);
  }
  function reset() {
    setKeyForResetting((keyForResetting) => keyForResetting + 1);
  }

  return (
    <div>
      {
        <>
          <Countdown
            key={keyForResetting}
            date={getSecondsInFuture(seconds)}
            autoStart={autoStart}
            renderer={({days, hours, minutes, seconds}) => {
              //TODO get seconds from combination of seconds hours and minutes to be more consitent
              return (
                <>
                  {renderView({
                    hours,
                    minutes,
                    seconds,
                    reset,
                    pause,
                    start,
                    isRunning,
                  })}
                </>
              );
            }}
            ref={autoRedirectCountDownRef}
            onComplete={onComplete}
          />
        </>
      }
    </div>
  );
}

export function CancelableCountdown({
  seconds,
  renderView = ({seconds, cancel}) => {
    return seconds;
  },
  onCancel = () => {},
  onComplete = () => {},
}) {
  const autoRedirectCountDownRef = useRef(null);
  const [isCanceled, setIsCanceled] = useState(false);
  function cancel() {
    autoRedirectCountDownRef.current.getApi().pause();
    setIsCanceled(true);
    return;
  }

  return (
    <div>
      {isCanceled ? (
        <></>
      ) : (
        <>
          <ControlledCountdown
            seconds={seconds}
            onPause={() => setIsCanceled(true)}
            renderView={({seconds, pause}) => {
              let cancel = pause;
              return renderView({seconds, cancel});
            }}
          />
        </>
      )}
    </div>
  );
}
