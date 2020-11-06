import React from "react";
import {render} from "@testing-library/react";
import Main from "./main";

test("Main renders ", () => {
  const utils = render(<Main />);
});
