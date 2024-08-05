import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";

import App from "./App.jsx";
import Loader from "./components/Loader/Loader.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={<Loader/>} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
