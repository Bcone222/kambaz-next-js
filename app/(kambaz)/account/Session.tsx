"use client";

import { ReactNode, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as client from "./client";
import { setCurrentUser } from "./reducer";

export default function Session({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    let ignore = false;
    client
      .profile()
      .then((user) => {
        if (!ignore) dispatch(setCurrentUser(user));
      })
      .catch(() => {})
      .finally(() => {
        if (!ignore) setPending(false);
      });
    return () => {
      ignore = true;
    };
  }, [dispatch]);

  if (pending) {
    return <div className="p-3">Loading...</div>;
  }
  return <>{children}</>;
}
