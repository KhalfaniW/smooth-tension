import React, {useState} from "react";

import {Game} from "components/game/gamify";
import {Stack} from "components/react-layout";
import LandingPage from "components/landing-page";
import LearnMorePage from "components/learn-more-page";
import StartPage from "components/start-page";

// import MeditationTimerGroup from "pages/meditation-timer-group";
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";

const LANDING_PAGE = "/";
const START_PAGE = "/start";
const MAIN_PAGE = "/main";
const LEARN_MORE_PAGE = "/about";
function MainWithRouter() {
  return (
    <Router>
      <BackGround>
        <Pages />
      </BackGround>
    </Router>
  );
}
function Pages() {
  let history = useHistory();
  function gotoPage(urlEnd) {
    history.push(urlEnd);
  }

  return (
    <Switch>
      <Route path={LEARN_MORE_PAGE}>
        <LearnMorePage onStartClick={() => gotoPage(MAIN_PAGE)} />
      </Route>
      <Route path={START_PAGE}>
        <StartPage onNextPageClick={() => gotoPage(MAIN_PAGE)} />
      </Route>
      <Route path={MAIN_PAGE}>
        <Stack width="100%">
          <Game />
        </Stack>
      </Route>
      <Route path={LANDING_PAGE}>
        <LandingPage
          onNextPageClick={() => gotoPage(START_PAGE)}
          onLearnMoreClick={() => gotoPage(LEARN_MORE_PAGE)}
          onQuickStartClick={() => gotoPage(MAIN_PAGE)}
        />
      </Route>
    </Switch>
  );
}
export default function Main() {
  return <MainWithRouter />;
  // return <MainOnePage />;
}
function BackGround({children}) {
  return (
    <div className="top-0 left-0 absolute w-screen min-h-screen bg-coolGray-100">
      {children}
    </div>
  );
}
function MainOnePage() {
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
      <BackGround>{pageToShow}</BackGround>
    </>
  );
}
