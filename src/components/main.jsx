import React, {useState} from "react";

import {Game} from "components/game/gamify";
import {Stack} from "components/react-layout";
import LandingPage from "components/landing-page";
import LearnMorePage from "components/learn-more-page";
import StartPage from "components/start-page";

// import MeditationTimerGroup from "pages/meditation-timer-group";

export default function Main() {
  let pageToShow;
  const LANDING_PAGE = 0;
  const START_PAGE = 1;
  const MAIN_PAGE = 2;
  const LEARN_MORE_PAGE = 3;

  const [page, setPage] = useState(LANDING_PAGE);

  switch (page) {
    case LANDING_PAGE:
      pageToShow = (
        <>
          <LandingPage
            onNextPageClick={() => setPage(START_PAGE)}
            onLearnMoreClick={() => setPage(LEARN_MORE_PAGE)}
            onQuickStartClick={() => setPage(MAIN_PAGE)}
          />
        </>
      );
      break;
    case START_PAGE:
      pageToShow = (
        <>
          <StartPage onNextPageClick={() => setPage(MAIN_PAGE)} />
        </>
      );
      break;

    case LEARN_MORE_PAGE:
      pageToShow = (
        <>
          <LearnMorePage onStartClick={() => setPage(MAIN_PAGE)} />
        </>
      );
      break;
    case MAIN_PAGE:
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
      <div className="top-0 left-0 absolute w-screen min-h-screen bg-coolGray-100">
        {pageToShow}
      </div>
    </>
  );
}
