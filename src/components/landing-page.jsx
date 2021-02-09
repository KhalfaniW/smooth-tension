import React, {useState} from "react";
import logo from "resources/logo.png";

export default function LandingPage({
  onLearnMoreClick,
  onNextPageClick,
  onQuickStartClick,
}) {
  const [shouldShowInstructions, setShouldShowInstructions] = useState(false);
  const NON_BOLD_HEADING = "mb-3  text-xl font-normal leading-tight lg:text-xl";
  const BASIC_BLUE_BUTTON =
    "py-2 px-4 capitalize tracking-wide bg-blue-600 dark:bg-gray-800 text-white font-medium rounded hover:bg-blue-500 dark:hover:bg-gray-700 focus:outline-none focus:bg-blue-500 dark:focus:bg-gray-700";

  //design from https://mambaui.com/components/call-to-action

  let action = (
    <section className="py-6 bg-coolGray-100 text-coolGray-900">
      <div className="mx-auto container flex flex-col items-center justify-center p-4 space-y-8 md:p-10 md:px-24 xl:px-48">
        <h1 className="text-4xl font-bold leading-none text-center">
          Build your willpower
        </h1>
        <ul className=" text-xl font-medium pl-2 ml-8 text-left  list-inside">
          <li className="pb-1">Live your values </li>
          <li className="pb-1">Master discomfort</li>
          <li className="pb-1">Replace addictive software with mindfulness</li>
        </ul>
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-8">
          <button
            onClick={() => {
              onNextPageClick();
            }}
            className="px-8 py-3 text-lg font-semibold rounded bg-blue-600 text-coolGray-50"
          >
            Get started
          </button>
          <button
            onClick={() => {
              onLearnMoreClick();
            }}
            className="px-8 py-3 text-lg font-normal border rounded bg-coolGray-800 text-coolGray-50 border-coolGray-700"
          >
            Learn more
          </button>
        </div>
      </div>
    </section>
  );

  //design from https://mambaui.com/components/
  return (
    <div classNameName=" min-h-screen  py-6 flex justify-center sm:py-12">
      <div className="p-4 w-full bg-coolGray-100 text-coolGray-800">
        <header className="mx-auto container flex justify-between h-16 border-b-2 border-coolGray-300">
          <img alt="Smooth tension logo" src={logo} />
          <p className="self-center px-8 py-3 text-xl  rounded">
            Smooth Tension
          </p>

          <div className="flex-shrink-0 hidden lg:block">
            <button
              onClick={() => {
                onQuickStartClick();
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
