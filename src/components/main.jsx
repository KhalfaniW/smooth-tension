import React from "react";

import {Stack} from "components/react-layout";

import PageVisibility from "react-page-visibility";
import {Game} from "./gamify";

// import MeditationTimerGroup from "pages/meditation-timer-group";
import {usePageVisibility} from "react-page-visibility";

export default function Main() {
  const isVisible = usePageVisibility();

  return (
    <>
      <Stack width="100%">
        <Game isVisible={isVisible} />
      </Stack>
    </>
  );
}
function StorageTools() {
  return (
    <>
      <button onClick={() => {}}>Save </button>
      <button onClick={() => {}}>Load</button>
    </>
  );
}
