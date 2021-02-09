import React, {useState} from "react";

import logo from "resources/logo.png";

// import MeditationTimerGroup from "pages/meditation-timer-group";

export default function LearnMorePage({onLearnMoreClick, onQuickStart}) {
  //design from https://mambaui.com/components/
  const stepConfigs = [
    {
      stepName: "Yeet",
      instructions: "woop",
    },
  ];

  return (
    <section className="bg-coolGray-100 text-coolGray-800">
      <div className="container flex flex-col p-6">
        <h2 className="py-4 text-3xl font-bold text-center">Temporibus elit</h2>
        <div className="divide-y divide-coolGray-300">
          <div className="grid justify-center grid-cols-4 p-8 mx-auto space-y-8 lg:space-y-0">
            <div className="flex items-center justify-center lg:col-span-1 col-span-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                fill="currentColor"
                className="w-16 h-16"
              >
                <path d="M472,16H168a24,24,0,0,0-24,24V344a24,24,0,0,0,24,24H472a24,24,0,0,0,24-24V40A24,24,0,0,0,472,16Zm-8,320H176V48H464Z"></path>
                <path d="M112,400V80H80V408a24,24,0,0,0,24,24H432V400Z"></path>
                <path d="M48,464V144H16V472a24,24,0,0,0,24,24H368V464Z"></path>
              </svg>
            </div>
            <div className="flex flex-col justify-center max-w-3xl text-center col-span-full lg:col-span-3 lg:text-left">
              <span className="text-xs tracking-wider uppercase text-violet-600">
                Step 1 - Nihil
              </span>
              <span className="text-xl font-bold md:text-2xl">
                Veritatis dolores
              </span>
              <span className="mt-4 text-coolGray-700">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam
                facilis, voluptates error alias dolorem praesentium sit soluta
                iure incidunt labore explicabo eaque, quia architecto veritatis
                dolores, enim cons equatur nihil ipsum.
              </span>
            </div>
          </div>

          <UserActionsStep
            sideImage={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                fill="currentColor"
                className="w-16 h-16"
              >
                <path d="M285.177,179l15.513-3.914-7.827-31.028-15.514,3.913a176.937,176.937,0,0,0-129.3,133.557l-3.407,15.633,31.266,6.814,3.406-15.634A145.559,145.559,0,0,1,285.177,179Z"></path>
                <path d="M363.624,147.871C343.733,72.077,274.643,16,192.7,16,95.266,16,16,95.266,16,192.7c0,82.617,57,152.163,133.735,171.4A176.769,176.769,0,0,0,320.7,496c97.431,0,176.7-79.266,176.7-176.695C497.392,238.071,441.64,167.336,363.624,147.871ZM48,192.7C48,112.91,112.91,48,192.7,48s144.7,64.91,144.7,144.7-64.911,144.7-144.7,144.7S48,272.481,48,192.7ZM320.7,464c-60.931,0-115.21-38.854-135.843-94.792,2.6.115,5.214.184,7.843.184a176.862,176.862,0,0,0,32.7-3.047l97.625,97.625C322.247,463.983,321.473,464,320.7,464Zm41.528-6.083L260.26,355.954a176.9,176.9,0,0,0,43.662-26.072L408.37,434.33A144.385,144.385,0,0,1,362.223,457.917Zm69.3-45.692L326.851,307.557a177.082,177.082,0,0,0,27.911-44.5L457.67,365.964A144.661,144.661,0,0,1,431.519,412.225Zm33.594-84.073-99.42-99.42a176.785,176.785,0,0,0,3.7-36.036c0-3.285-.1-6.547-.276-9.787a145.054,145.054,0,0,1,96.276,136.4C465.392,322.276,465.291,325.224,465.113,328.152Z"></path>
              </svg>
            }
            stepTitle={"Notice Your Actions"}
            instructions={`                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam
                 facilis, voluptates error alias dolorem praesentium sit soluta
                 iure incidunt labore explicabo eaque, quia architecto veritatis
                 dolores, enim cons equatur nihil ipsum.
`}
            stepNumber={2}
          />

          <div className="flex flex-col justify-center max-w-3xl text-center col-span-full lg:col-span-3 lg:text-left">
            <span className="text-xs tracking-wider uppercase text-violet-600">
              Step 2 - Explicabo
            </span>
            <span className="text-xl font-bold md:text-2xl">
              Iure incidunt labore
            </span>
            <span className="mt-4 text-coolGray-700"></span>
          </div>
        </div>

        <div className="grid justify-center grid-cols-4 p-8 mx-auto space-y-8 lg:space-y-0">
          <div className="flex items-center justify-center lg:col-span-1 col-span-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              fill="currentColor"
              className="w-16 h-16"
            >
              <polygon points="388.632 393.82 495.823 255.94 388.684 118.178 363.424 137.822 455.288 255.944 363.368 374.18 388.632 393.82"></polygon>
              <polygon points="148.579 374.181 56.712 255.999 148.629 137.823 123.371 118.177 16.177 255.993 123.314 393.819 148.579 374.181"></polygon>
              <polygon points="330.529 16 297.559 16 178.441 496 211.412 496 330.529 16"></polygon>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
function UserActionsStep({
  stepShortName = null,
  stepTitle,
  sideImage,
  instructions,
  stepNumber,
}) {
  return (
    <div className="grid justify-center grid-cols-4 p-8 mx-auto space-y-8 lg:space-y-0">
      <div className="flex items-center justify-center lg:col-span-1 col-span-full">
        {sideImage}
      </div>

      <div className="flex flex-col justify-center max-w-3xl text-center col-span-full lg:col-span-3 lg:text-left">
        <span className="text-xs tracking-wider uppercase text-violet-600">
          Step {stepNumber} {stepShortName ? <> - {stepShortName}</> : null}
        </span>
        <span className="text-xl font-bold md:text-2xl">{stepTitle}</span>
        <span className="mt-4 text-coolGray-700">{instructions}</span>
      </div>
    </div>
  );
}
