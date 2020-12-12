import {Checkbox, InputAdornment, TextField} from "@material-ui/core";
import React, {useState} from "react";
import lodash from "lodash";

import {ItemLine, Stack} from "components/react-layout";

export default function ProjectStepCreator({}) {
  const [stepsCompleted, setStepsCompleted] = useState({step1: false});
  function createCheckBox(index) {
    return (
      <>
        <ItemLine>
          <Checkbox
            /* checked={false} */
            /* onChange={handleChange} */
            inputProps={{"aria-label": "primary checkbox"}}
          />
          <TextField
            label={`Step ${index}`}
            onChange={(event) => {
              /* setWorkTimerMinutes(event.target.value); */
            }}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            /* value={workTimerMinutes} */
          />
        </ItemLine>
      </>
    );
  }
  return (
    <>
      <Stack spacing={7} width="100%">
        <h1>Enter project steps</h1>
        {lodash.range(1, 5).map((i) => {
          return <div key={i}>{createCheckBox(i)}</div>;
        })}
      </Stack>
    </>
  );
}
