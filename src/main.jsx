import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { registerWorker } from "./worker.js";
import "./styles.css";

registerWorker();
createRoot(document.getElementById("root")).render(<App />);
