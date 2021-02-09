import React, {useState} from "react";

export default function StartPage({onNextPageClick}) {
  const NON_BOLD_HEADING = "mb-3  text-xl font-normal leading-tight lg:text-xl";
  const BASIC_BLUE_BUTTON =
    "py-2 px-4 capitalize tracking-wide bg-blue-600 dark:bg-gray-800 text-white font-medium rounded hover:bg-blue-500 dark:hover:bg-gray-700 focus:outline-none focus:bg-blue-500 dark:focus:bg-gray-700";
  return (
    <>
      <section className=" mt-4 p-6 h-4/5">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center text-coolGray-900">
            Convert Tension to Action
          </h2>
          <div className="grid gap-6 my-8 lg:grid-cols-3">
            <div className="flex flex-col p-8 space-y-4 rounded-md bg-coolGray-50">
              <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-bold rounded-full bg-blue-600 text-coolGray-50">
                1
              </div>

              <p className=" ">
                <h3 className="pb-4 ">Create Tension </h3>

                <ul className="">
                  Ideas
                  <ul className="pb-2 pl-3 list-disc text-left">
                    <li>Stretch one arm behind your back</li>
                    <li>Tighten your abdomen</li>
                    <li>Flex one of your calves</li>
                  </ul>
                </ul>
              </p>
            </div>
            <div className="flex flex-col p-8 space-y-4 rounded-md bg-coolGray-50">
              <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-bold rounded-full bg-blue-600 text-coolGray-50">
                2
              </div>
              <p className="">Use this app to convert tension into action.</p>
            </div>
            <div className="flex flex-col p-8 space-y-4 rounded-md bg-coolGray-50">
              <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-bold rounded-full bg-blue-600 text-coolGray-50">
                3
              </div>
              <p className="">
                Start doing what you value instead of wasting your time{" "}
              </p>
            </div>
          </div>
        </div>
      </section>
      <button
        onClick={() => {
          onNextPageClick();
        }}
        className={
          "px-8 py-3 text-lg font-semibold rounded bg-blue-600 text-coolGray-50"
        }
      >
        Go
      </button>
    </>
  );
}
