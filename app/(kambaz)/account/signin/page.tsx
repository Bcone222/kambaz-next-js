"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { FormControl, Button } from "react-bootstrap";
import * as client from "../client";

export default function Signin() {
  const [credentials, setCredentials] = useState<{ username: string; password: string }>(
    { username: "", password: "" }
  );
  const dispatch = useDispatch();
  const router = useRouter();

  const signin = async () => {
    try {
      const user = await client.signin(credentials);
      if (!user) return;
      dispatch(setCurrentUser(user));
      router.push("/dashboard");
    } catch {
      /* invalid credentials */
    }
  };

  return (
    <div id="wd-signin-screen">
      <h1>Sign in</h1>
      <FormControl
        value={credentials.username}
        onChange={(e) =>
          setCredentials({ ...credentials, username: e.target.value })
        }
        className="mb-2"
        placeholder="username"
        id="wd-username"
      />
      <FormControl
        value={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
        className="mb-2"
        placeholder="password"
        type="password"
        id="wd-password"
      />
      <Button onClick={signin} id="wd-signin-btn" className="w-100">
        Sign in
      </Button>
      <Link id="wd-signup-link" href="/account/signup">
        Sign up
      </Link>
    </div>
  );
}
