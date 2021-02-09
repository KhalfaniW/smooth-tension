import React, {useState} from "react";

import {Game} from "components/game/gamify";
import {Stack} from "components/react-layout";
import LearnMorePage from "components/learn-more-page";
import logo from "resources/logo.png";

// import MeditationTimerGroup from "pages/meditation-timer-group";
const tabs = Object.freeze({
  LANDING: "landing",
  START_INSTRUCTIONS: "start_instructions",
  GAME: "game",
  LEARN_MORE: "learn_more",
});
export default function Main() {
  let pageToShow;
  const [n, setPage] = useState(0);
  const START_PAGE = 1;
  const MAIN_PAGE = 2;
  const LEARN_MORE_PAGE = 3;

  const currentTab = Object.values(tabs)[n];
  switch (currentTab) {
    case tabs.LANDING:
      pageToShow = (
        <>
          <LandingPage onQuickStart={() => setPage(MAIN_PAGE)} />
        </>
      );
      break;
    case tabs.START_INSTRUCTIONS:
      pageToShow = <>{/* <LearnMorePage /> */}</>;
      break;
    case tabs.GAME:
      pageToShow = (
        <Stack width="100%">
          <Game />
        </Stack>
      );
      break;
    default:
      pageToShow = "ERROR";
  }
  return (
    <>
      {pageToShow}

      <button onClick={() => setPage((n) => (n + 1) % 4)}> Switch </button>
    </>
  );
}
function LandingPage({onLearnMoreClick, onQuickStart}) {
  const [shouldShowInstructions, setShouldShowInstructions] = useState(false);
  const NON_BOLD_HEADING = "mb-3  text-xl font-normal leading-tight lg:text-xl";
  const BASIC_BLUE_BUTTON =
    "py-2 px-4 capitalize tracking-wide bg-blue-600 dark:bg-gray-800 text-white font-medium rounded hover:bg-blue-500 dark:hover:bg-gray-700 focus:outline-none focus:bg-blue-500 dark:focus:bg-gray-700";
  let action = null;
  if (shouldShowInstructions) {
    //design from https://mambaui.com/components/call-to-action
    action = (
      <section className="py-6 bg-coolGray-100 text-coolGray-900">
        <div className="container flex flex-col items-center justify-center p-4 space-y-8 md:p-10 md:px-24 xl:px-48">
          <h1 className="text-4xl font-bold leading-none text-center">
            Train your willpower
          </h1>
          <p className="text-xl font-medium text-center">
            <p>Live your values</p>
            <p>Master discomfort</p>
            <p>Replace addictive software with mindfulness</p>
          </p>
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-8">
            <button
              onClick={() => {
                setShouldShowInstructions(true);
              }}
              className="px-8 py-3 text-lg font-semibold rounded bg-blue-600 text-coolGray-50"
            >
              Get started
            </button>
            <button className="px-8 py-3 text-lg font-normal border rounded bg-coolGray-800 text-coolGray-50 border-coolGray-700">
              Learn more
            </button>
          </div>
        </div>
      </section>
    );
  } else {
    action = (
      <section className="py-6 bg-coolGray-100 text-coolGray-900">
        <div className="container flex flex-col items-center justify-center p-4 space-y-8 md:p-10 md:px-24 xl:px-48">
          <h1 className="text-4xl font-bold leading-none text-center">
            Build your willpower
          </h1>
          <ul className=" text-xl font-medium pl-2 ml-8 text-left  list-inside">
            <li className="pb-1">Live your values </li>
            <li className="pb-1">Master discomfort</li>
            <li className="pb-1">
              Replace addictive software with mindfulness
            </li>
          </ul>
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-8">
            <button
              onClick={() => {
                setShouldShowInstructions(true);
              }}
              className="px-8 py-3 text-lg font-semibold rounded bg-blue-600 text-coolGray-50"
            >
              Get started
            </button>
            <button className="px-8 py-3 text-lg font-normal border rounded bg-coolGray-800 text-coolGray-50 border-coolGray-700">
              Learn more
            </button>
          </div>
        </div>
      </section>
    );
  }

  //design from https://mambaui.com/components/
  return (
    <div classNameName="w-full min-h-screen  py-6 flex justify-center sm:py-12">
      <div className="p-4 bg-coolGray-100 text-coolGray-800">
        <header className="container flex justify-between h-16 border-b-2 border-coolGray-300">
          <img alt="Smooth tension logo" src={logo} />
          <p className="self-center px-8 py-3 text-xl  rounded">
            Smooth Tension
          </p>

          <div className="flex-shrink-0 hidden lg:block">
            <button
              onClick={() => {
                onQuickStart();
              }}
              className="self-center px-8 py-3 rounded-full bg-gray-600 text-coolGray-50"
            >
              Quick Start
            </button>
          </div>
          <button className="flex justify-end p-4 lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </header>
      </div>
      {action}
    </div>
  );
}
