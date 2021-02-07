import {Checkbox, FormControlLabel} from "@material-ui/core";
import React, {useState} from "react";
import styled from "styled-components";

export function UserOneTimeActions({
  onComplete,
  completedList,
  actionList,
  valueList,
}) {
  function getIsComplete(name) {
    return completedList.includes(name);
  }
  function handleCheckboxSelect(event) {
    const item = event.target.name;
    if (event.target.checked) {
      onComplete(item);
    }
  }
  return (
    <ActionListBox>
      {actionList.map((_, index) => {
        const userAction = actionList[index];
        const actionValue = valueList[index];
        return (
          <FormControlLabel
            key={userAction}
            value="start"
            label={userAction + " |  value:" + actionValue}
            disabled={getIsComplete(userAction)}
            name={userAction}
            control={
              <Checkbox color="primary" onChange={handleCheckboxSelect} />
            }
          />
        );
      })}
    </ActionListBox>
  );
}
const ActionListBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  width: 80%;
  border: 1px solid black;
  border-radius: 5%;
  overflow: auto;
`;
