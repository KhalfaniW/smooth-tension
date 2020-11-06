import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import {useMap, useSet} from "react-use";
import React, {useEffect, useState} from "react";
import lodash, {uniq} from "lodash";

import {MeditationTimer} from "components/timers";
import {Stack} from "components/react-layout";
import CalmPlaylist from "components/calm-playlist";

// import MeditationTimerGroup from "pages/meditation-timer-group";

let infoForWhyMustBelive = `
  The current action must be somthing you believe you can do

  If you do not beleive you can do the task then replace the taks with the first small action you can take to begin.

  For example,
   + Very Difficult Task: Walk 10 miles
   + First Action: Walk 5 steps

  
`;
let otherInfo = `
Breating Exercises
Level 1 30 sec
Level 2  1 min 


- test
- do for 10 seconds com back if needed and stop the timer
- did you work for 10 seconsd
- if not go make the task smaller or go back to the harmaony section
- if did dmore than ten seconds why did you do ti.
  - was it easier than expected
  - are you just strong 
  - 



Placebo effect
 + set energy level
   - 
`;
export default function Main() {
  let range5to1 = [5, 4, 3, 2, 1];

  return (
    <>
      <Stack width="100%">
        <MeditationTimer seconds={6} />
        <CalmPlaylist />
      </Stack>
    </>
  );
}

function DiscomfortLocator() {
  // categoriesAndChoices,
  // partsToSelect = ["Head", "torso"],

  let uniqueDiscomfortLocations = [
    {category: "Head", choices: ["face", "back", "top", "middle"]},
    {category: "Left Arm", choices: ["shoulder", "hand", "forearm", "bicep"]},
    {category: "Right Arm", choices: ["shoulder", "hand", "forearm", "bicep"]},
    {category: "Left Leg", choices: ["shins", "calf", "knee", "left foot"]},
    {category: "Right Leg", choices: ["shins", "calf", "knee", "right foot"]},
    {
      category: "Torso",
      choices: ["chest", "upper back", "lower back", "stomach"],
    },
  ];
  let discomfortCategories = uniqueDiscomfortLocations.map(
    (categoryAndChoice) => {
      return categoryAndChoice.category;
    },
  );

  let discomfortCategoriesSet = uniq(discomfortCategories);

  const [
    selectedDiscomfortCategoriesSet,
    {
      add: addCategory,
      remove: removeCategory,
      has: getIsInCategorySet,
      toggle: toggle1,
    },
  ] = useSet(new Set([]));

  let discomfortLocationSetToDiveDeeperInto = uniqueDiscomfortLocations.filter(
    (discomfortLocation) => {
      return getIsInCategorySet(discomfortLocation.category);
    },
  );
  return (
    <>
      <>
        <CheckboxGroup
          title={"Where do you feel any discomfort"}
          uniqueChoices={discomfortCategoriesSet}
          onDeselect={(deselectedItem) => {
            removeCategory(deselectedItem);
          }}
          onSelect={(selectedItem) => {
            addCategory(selectedItem);
          }}
        />

        <h1>Dive Deeper</h1>
        {discomfortLocationSetToDiveDeeperInto.map((categoryAndChoice) => {
          return (
            <CheckboxGroup
              //you can use the category as a key becuase it is a set
              key={categoryAndChoice.category}
              title={categoryAndChoice.category}
              uniqueChoices={categoryAndChoice.choices}
              onSelect={(selectedItems) => console.log({selectedItems})}
            />
          );
        })}
      </>
    </>
  );
}
function throwIfHasDuplicates(original_items) {
  const items = [...original_items];
  if (items.length < 2) {
    return;
  }
  if (lodash.isEqual(items.sort(), uniq(items).sort())) {
    return;
  }
  throw `item group cannot have duplicates items = ${items}`;
}

//TODO CHECK ITEMS UNIQUE
export function CheckboxGroup({
  title,
  uniqueChoices,
  onSelect = (items) => {},
  onDeselect = (items) => {},
}) {
  const choiceStrings = uniqueChoices.map((choice) => {
    return String(choice);
  });
  throwIfHasDuplicates(choiceStrings);

  let checkboxOptions = {};
  choiceStrings.forEach((choice) => {
    return (checkboxOptions[choice] = false);
  });

  const [
    checkboxItemIsCheckedMap,
    {set: setCheckboxItemState, remove, reset},
  ] = useMap(checkboxOptions);

  const [recentlyDeselectedItem, setRecentlyDeselectedItem] = useState(null);
  const [recentlySelectedItem, setRecentlySelectedItem] = useState(null);

  //put on change in effect incase it sets parent state
  useEffect(() => {
    if (recentlyDeselectedItem === null) {
      return;
    }
    onDeselect(recentlyDeselectedItem);
    setRecentlyDeselectedItem(null);
  }, [recentlyDeselectedItem]);
  useEffect(() => {
    if (recentlySelectedItem === null) {
      return;
    }
    onSelect(recentlySelectedItem);
    setRecentlySelectedItem(null);
  }, [recentlySelectedItem]);

  function handleSelect(event) {
    const checkboxName = event.target.value;
    const checkboxWillBecomeChecked = !checkboxItemIsCheckedMap[checkboxName];
    if (checkboxWillBecomeChecked) {
      setRecentlySelectedItem(checkboxName);
    } else {
      setRecentlyDeselectedItem(checkboxName);
    }
    setCheckboxItemState(
      event.target.value,
      !checkboxItemIsCheckedMap[checkboxName],
    );
  }
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">
        <h1>{title}</h1>
      </FormLabel>

      <FormGroup row aria-label={`${title} rating`} name={`${title} rating`}>
        {choiceStrings.map((choice, index) => (
          <FormControlLabel
            // items are not edited,filtered,or reorderd so it is okay to us key as index
            key={`_${choice}`}
            label="Start"
            value={choice}
            control={
              <Checkbox
                checked={checkboxItemIsCheckedMap[choice]}
                onChange={handleSelect}
                name={choice}
              />
            }
            label={choice}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
}

export function RadioButtonGroupWithUniqueChoices({
  title,
  uniqueChoices,
  propertySelectionProgressIncrease = 2,
}) {
  const [isRatingChoiceEmpty, setIsRatingChoiceEmpty] = useState(true);

  const choiceStrings = uniqueChoices.map((choice) => {
    return String(choice);
  });
  throwIfHasDuplicates(choiceStrings);

  const [selectionValue, setSelectionValue] = useState(null);

  const handleChange = (event) => {};
  function handleSelect(event) {
    setSelectionValue(event.target.value);
  }
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">
        <h1>{title}</h1>
      </FormLabel>

      <RadioGroup
        row
        aria-label={`${title} rating`}
        name={`${title} rating`}
        value={selectionValue}
        onChange={handleSelect}
      >
        {choiceStrings.map((choice, index) => (
          <FormControlLabel
            key={`_${choice}`}
            label="Start"
            value={choice}
            control={<Radio />}
            label={choice}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}

function Inline({
  children,
  width = "100%",
  spacing = "even",
  align = "center",
}) {
  let SpacingOptions = [
    "even",
    "medium",

    "xx-small",

    "x-small",

    "small",

    "large",

    "x-large",

    "xx-large",
  ];

  return (
    <div
      style={{
        width: width,
        display: "flex",
        placeItems: "center",
        flexDirection: "row",
      }}
    >
      {children}
    </div>
  );
}
