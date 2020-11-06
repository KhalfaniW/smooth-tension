import {range} from "lodash";
import Countdown from "react-countdown";
import React, {useState, useRef} from "react";

export function MeditationTimer({
  seconds = 300,
  shouldAutoStart = true,
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
  const secondFormated = `${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;
  const minutesFormated = `${minutesLeft < 10 ? "0" : ""}${minutesLeft}`;
  const hoursFormated = `${hoursLeft < 10 ? "0" : ""}${hoursLeft}`;
  let totalTime = secondFormated;
  if (minutesLeft > 0) {
    totalTime += ":" + minutesFormated;
    if (hoursLeft > 0) {
      totalTime += ":" + hoursFormated;
    }
  }
  let totalSeconds = seconds;
  return (
    <>
      <div>{totalTime}</div>
      <PauseableCountdown
        seconds={seconds}
        shouldAutoStart={shouldAutoStart}
        renderView={({hours, minutes, seconds, unPause, pause}) => {
          return (
            <>
              {meditationMessageFromTime({
                seconds: seconds,
                totalSeconds: totalSeconds,
              })}
              <button
                onClick={() => {
                  pause();
                }}
              >
                pause
              </button>
              <button
                onClick={() => {
                  unPause();
                }}
              >
                continue
              </button>
            </>
          );
        }}
      />
    </>
  );
}

function countDownTools() {
  return {
    getSecondsInFuture: (seconds) => {
      return Date.now() + seconds * 1000;
    },
  };
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

export function PauseableCountdown({
  seconds,
  renderView = ({seconds}) => {
    return seconds;
  },
  shouldAutoStart = false,
  onPause = () => {},
  onComplete = () => {},
}) {
  const autoRedirectCountDownRef = useRef(null);
  function getSecondsInFuture(seconds) {
    return Date.now() + seconds * 1000;
  }
  function pause() {
    autoRedirectCountDownRef.current.getApi().pause();
    onPause();
  }
  function unPause() {
    autoRedirectCountDownRef.current.getApi().start();
  }

  return (
    <div>
      {
        <>
          <Countdown
            date={getSecondsInFuture(seconds)}
            precision={2}
            intervalDelay={400}
            autoStart={false}
            renderer={({days, hours, minutes, seconds}) => {
              //TODO get seconds from combination of seconds hours and minutes to be more consitent
              return (
                <>{renderView({hours, minutes, seconds, pause, unPause})}</>
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
          <PauseableCountdown
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
