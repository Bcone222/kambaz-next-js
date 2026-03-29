"use client";
import { ReactNode } from "react";
import KambazNavigation from "./Navigation";
import store from "./store";
import { Provider } from "react-redux";
import Session from "./account/Session";
import "./styles.css";

export default function KambazLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <Provider store={store}>
      <Session>
        <div id="wd-kambaz" className="d-flex">
          <div>
            <KambazNavigation />
          </div>
          <div className="wd-main-content-offset p-3 flex-fill">{children}</div>
        </div>
      </Session>
    </Provider>
  );
}
