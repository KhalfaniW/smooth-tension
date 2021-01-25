import {Checkbox, FormControlLabel} from "@material-ui/core";
import React, {useState} from "react";

export function UserOneTimeActions({onComplete, actionList}) {
  const originalDictionary = actionList.reduce(function(dictionary, item) {
    dictionary[item] = false;
    return dictionary;
  }, {});

  const [isCompletedDictionary, setDictionary] = useState({
    ...originalDictionary,
  });
  function handleCheckboxSelect(event) {
    const item = event.target.name;
    const hasItemNotBeenCompleted = isCompletedDictionary[item] === false;

    if (event.target.checked && hasItemNotBeenCompleted) {
      onComplete(item);
      setDictionary((isCompletedDictionary) => {
        return {...isCompletedDictionary, [item]: true};
      });
    }
  }
  return (
    <div>
      {actionList.map((userAction) => (
        <FormControlLabel
          key={userAction}
          value="start"
          label={userAction}
          disabled={isCompletedDictionary[userAction]}
          name={userAction}
          control={<Checkbox color="primary" onChange={handleCheckboxSelect} />}
        />
      ))}
    </div>
  );
}
