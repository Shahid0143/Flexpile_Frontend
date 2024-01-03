import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Board from "./Components/Board";

function App() {
  return (
    <>
      <div className="main_box">
        <h3>
          {" "}
          <Board />
        </h3>
      </div>
    </>
  );
}

export default App;
