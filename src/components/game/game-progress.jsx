import {Checkbox, FormControlLabel} from "@material-ui/core";
import React, {useState} from "react";
import {Spring} from "react-spring/renderprops";

export function ActionProgress({}) {
  return (
    <>
      <Spring from={{value: 50}} to={{value: 100}} config={{duration: 5000}}>
        {(props) => (
          <div style={{width: "70%"}}>
            {/* <ReactBootstrapStyle /> */}
            {/* <ProgressBar now={props.value} /> */}
            {props.value.toFixed(0)}/100
          </div>
        )}
      </Spring>
    </>
  );
}
export function ProgressView({gameState, progressAmount}) {
  return (
    <div>
      Power {progressAmount.toFixed(1)}
      <div>{gameState.isVisible ? "" : "Paused"}</div>
      <div>Speed: {gameState.speedMultiplier}</div>
      <div>{gameState.isFocusModeEnabled ? "focused" : null} </div>
    </div>
  );
}
