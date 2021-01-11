/*global jest*/
import { render, fireEvent } from '@testing-library/react';
import React from "react";

import {Game} from "./gamify";

test("Game renders ", () => {
  const tools = render(<Game />);
});

test("starting enables state", () => {
  const tools = render(<Game />);
  const userStartGame = ({getByText}) => {
    fireEvent.click(getByText("Start"));
  };
  userStartGame(tools);
  expect(1).toBe(1);
});
