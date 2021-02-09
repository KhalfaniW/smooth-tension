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
    <div className=" w-full p-8  flex justify-center font-sans">
      <div className="rounded bg-gray-200 w-64 p-2 shadow-xl">
        <div className="flex flex-col py-1 items-center">
          <h3>Get Spins</h3>
        </div>

        {actionList.map((_, index) => {
          const userAction = actionList[index];
          const actionValue = valueList[index];
          return (
            <div
              key={userAction}
              className="bg-white p-2 rounded mt-1 border-b border-gray cursor-pointer hover:bg-grey-lighter"
            >
              <FormControlLabel
                value="start"
                label={userAction}
                disabled={getIsComplete(userAction)}
                name={userAction}
                control={
                  <Checkbox color="primary" onChange={handleCheckboxSelect} />
                }
              />
              <div className=" w-full justify-center pb-2">
                value: {actionValue}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
const ActionListBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;

  width: 80%;

  border-radius: 5%;
  overflow: auto;
`;
