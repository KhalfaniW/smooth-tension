import "./App.css";

import React from "react";

// import {AppStyles} from "styles/app-tw-styles";

import Main from "./components/main";

function App() {
  return (
    <>
      <div className="App">
        <Main />
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
      >
        Sign In
      </button>
    </>
  );
}

export default App;
