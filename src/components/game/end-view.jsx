import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faCoffee,
  faExclamation,
  faRedo,
  faBahai,
  faRedoAlt,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import Fade from "react-reveal/Fade";
export default function EndView({gameState, dispatch}) {
  //design from https://mambaui.com/components/steps
  return (
    <>
      <>
        <Fade bottom>
          <div>
            <section className="p-6">
              <div className="container">
                <span className="block mb-2 text-xs font-medium tracking-widest text-center uppercase text-violet-600">
                  Training Complete
                </span>
                <h2 className="text-5xl font-bold text-center text-coolGray-900">
                  Choose Your Next Step
                </h2>
                <div className="grid gap-6 my-16 lg:grid-cols-3">
                  <div className="flex flex-col p-8 space-y-4 rounded-md bg-coolGray-50">
                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-bold rounded-full bg-violet-600 text-coolGray-50">
                      a
                    </div>
                    <p className="text-2xl font-semibold">
                      Open the activity you would rather be doing.
                    </p>
                  </div>
                  <div className="flex flex-col p-8 space-y-4 rounded-md bg-coolGray-50">
                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-bold rounded-full bg-violet-600 text-coolGray-50">
                      b
                    </div>
                    <p className="text-2xl font-semibold">
                      Take a break from technology
                    </p>
                  </div>
                  <div className="flex flex-col p-8 space-y-4 rounded-md bg-coolGray-50">
                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-bold rounded-full bg-violet-600 text-coolGray-50">
                      c
                    </div>

                    <p className="text-2xl font-semibold">
                      Block distractions with a website blocker.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            <button
              onClick={() => {
                dispatch({type: "RESET_GAME", now: Date.now()});
              }}
              className="px-8 py-3 text-lg font-normal border rounded bg-coolGray-800 text-coolGray-50 border-coolGray-700"
            >
              <FontAwesomeIcon icon={faRedo} /> Reset
            </button>
          </div>
        </Fade>
      </>
    </>
  );
}
