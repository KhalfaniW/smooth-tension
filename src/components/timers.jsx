import {range} from "lodash";
import Countdown from "react-countdown";
import React, {useState, useRef} from "react";

export function MeditationTimer({
  seconds = 300,
  shouldAutoStart = true,
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
  const secondsFormated = `${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;
  const minutesFormated = `${minutesLeft < 10 ? "0" : ""}${minutesLeft}`;
  const hoursFormated = `${hoursLeft < 10 ? "0" : ""}${hoursLeft}`;
  let totalTime = secondsFormated;
  if (minutesLeft > 0) {
    totalTime += ":" + minutesFormated;
    if (hoursLeft > 0) {
      totalTime += ":" + hoursFormated;
    }
  }
  let totalSeconds = seconds;

  return (
    <>
      <div>{getFormattedTime(seconds)}</div>
      <PauseableCountdown
        seconds={seconds}
        shouldAutoStart={shouldAutoStart}
        renderView={({hours, minutes, seconds, unPause, pause}) => {
          console.log({hours, minutes, seconds, unPause, pause});
          console.log({
            sum: seconds + 60 * minutes + 360 * hours,
            total: totalSeconds,
          });
          const meditationMessage = meditationMessageFromTime({
            seconds: seconds + 60 * minutes + 360 * hours,
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
          console.log({
            message: meditationMessage,
            style: JSON.stringify(meditationIndicatorStyle, null, 1),
          });
          meditationIndicator = (
            <div style={meditationIndicatorStyle}>{meditationMessage}</div>
          );

          return (
            <>
              {meditationIndicator}
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
  const secondsFormated = `${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;
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
      <ControlledCountdown
        seconds={seconds}
        onComplete={onComplete}
        renderView={({hours, minutes, seconds, start, pause, reset}) => {
          const totalRemainingSeconds = hours * 360 + minutes * 60 + seconds;
          let formattedTime = getFormattedTime(totalRemainingSeconds);
          return (
            <>
              {formattedTime}
              <button
                onClick={() => {
                  pause();
                }}
              >
                Pause
              </button>

              <button
                onClick={() => {
                  reset();
                }}
              >
                Reset
              </button>
              <button
                onClick={() => {
                  start();
                }}
              >
                Start
              </button>
            </>
          );
        }}
      />
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
export function ControlledCountdown({
  seconds,
  renderView = ({seconds}) => {
    return seconds;
  },
  shouldAutoStart = false,
  onPause = () => {},
  onComplete = () => {},
}) {
  const autoRedirectCountDownRef = useRef(null);
  const [keyForResetting, setKeyForResetting] = useState(0);
  function getSecondsInFuture(seconds) {
    return Date.now() + seconds * 1000;
  }
  function pause() {
    autoRedirectCountDownRef.current.getApi().pause();
    onPause();
  }
  function start() {
    autoRedirectCountDownRef.current.getApi().start();
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
            autoStart={false}
            renderer={({days, hours, minutes, seconds}) => {
              //TODO get seconds from combination of seconds hours and minutes to be more consitent
              return (
                <>
                  {renderView({hours, minutes, seconds, reset, pause, start})}
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
            /* precision={2} */
            /* intervalDelay={400} */
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
