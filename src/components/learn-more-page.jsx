import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faCoffee,
  faExclamation,
  faBrain,
  faBahai,
  faRedoAlt,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";

export default function LearnMorePage({onStartClick}) {
  //design from https://mambaui.com/components/
  return (
    <div>
      <section className="bg-coolGray-100 text-coolGray-800">
        <div className="m-auto container flex flex-col p-6">
          <h2 className="py-4 text-4xl font-bold text-center">
            How Smooth Tension Works
          </h2>
          <div className="divide-y divide-coolGray-300">
            <UserActionsStep
              stepNumber={1}
              sideImage={<FontAwesomeIcon icon={faExclamation} size="5x" />}
              stepTitle={"Notice Your Actions"}
              instructions={`Notice when you are not doing something you value. Be mindful that you want to stop mindless scrolling `}
            />
            <UserActionsStep
              stepNumber={2}
              sideImage={<FontAwesomeIcon icon={faBahai} size="5x" />}
              stepTitle={"Create Tension"}
              instructions={`Create physical discomfort by tensing your musicales or doing a light stretch. This will give you the willpower to leave whatever is stealing your attention you.`}
            />
            <UserActionsStep
              stepNumber={3}
              sideImage={<FontAwesomeIcon icon={faRedoAlt} size="5x" />}
              stepTitle={"Open This App To Release Tension"}
              instructions={`Train your self to hold the tension until this app tells you to release tension`}
            />
            <UserActionsStep
              stepNumber={3.5}
              sideImage={<FontAwesomeIcon icon={faBrain} size="5x" />}
              stepTitle={"Experience the Neuroscience"}
              instructions={`This app uses many of the used in mobile games and social media to get you addicted. They convert discomfort into time spent on the site. This app will convert discomfort by making you do tasks to release the tension you created.`}
            />
            <UserActionsStep
              stepNumber={4}
              sideImage={<FontAwesomeIcon icon={faCheckCircle} size="5x" />}
              stepTitle={"Do What You Value"}
              instructions={`After using this app you will be in the best state of mind to start doing what you actually value. Close the distracting website. Open the website you value and and get started.`}
            />
          </div>
        </div>
      </section>
      <button
        onClick={() => {
          onStartClick(true);
        }}
        className="mb-8 px-8 py-3 text-lg font-semibold rounded bg-blue-600 text-coolGray-50"
      >
        Get started
      </button>
    </div>
  );
}
function UserActionsStep({
  stepShortName = null,
  stepTitle,
  sideImage,
  instructions,
  stepNumber,
}) {
  return (
    <div className="grid justify-center grid-cols-4 p-8 mx-auto space-y-8 lg:space-y-0">
      <div className="flex items-center justify-center lg:col-span-1 col-span-full">
        {sideImage}
      </div>

      <div className="flex flex-col justify-center max-w-3xl text-center col-span-full lg:col-span-3 lg:text-left">
        <span className="text-xs tracking-wider uppercase text-blue-600">
          Step {stepNumber} {stepShortName ? <> - {stepShortName}</> : null}
        </span>
        <span className="text-xl font-bold md:text-2xl">{stepTitle}</span>
        <span className="mt-4 text-coolGray-700">{instructions}</span>
      </div>
    </div>
  );
}
