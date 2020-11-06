import React from "react";

import {v4 as uuid} from "uuid";

//TODO add proptypes

const maxZIndex = 9999;

export default function PositionContainer({
  positionIndexFromTheBottom,
  side,
  style,
  children,
}) {
  const childGroup = [children];
  const positionIndexFromTheBottomGroup = [positionIndexFromTheBottom];

  //Use distance from bottom so when new things are added below they expand below
  function wrapWithPosition(child) {
    const distanceFromTop = `${100 - positionIndexFromTheBottom * 10}%`;
    let verticalPositionStyle = {top: distanceFromTop};
    if (positionIndexFromTheBottom === 0) {
      verticalPositionStyle = {bottom: 0};
    }

    let sideStyle = {right: 0};
    return (
      <div
        key={uuid()}
        style={{
          /* position: "fixed", */
          /* zIndex: maxZIndex, */
          ...verticalPositionStyle,
          ...sideStyle,
          ...style,
        }}
      >
        {child}
      </div>
    );
  }
  //model the size after the material ui
  return <>{childGroup}</>;
}
