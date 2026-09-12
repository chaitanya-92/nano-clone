import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import { AuthBootstrap } from "@/components/auth/AuthBootstrap";
import { store, persistor } from "@/store/store";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthBootstrap />
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>,
);
