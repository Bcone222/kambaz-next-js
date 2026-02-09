import Link from "next/link";
import { FormControl, Button } from "react-bootstrap";

export default function Signin() {
  return (
    <div id="wd-signin-screen" className="p-4">
      <h1>Sign in</h1>
      <FormControl
        className="mb-2"
        id="wd-username"
        type="text"
        placeholder="username"
      />
      <FormControl
        className="mb-2"
        id="wd-password"
        type="password"
        placeholder="password"
      />
      <Link
        id="wd-signin-btn"
        className="btn btn-primary w-100 mb-2"
        href="/dashboard"
      >
        Sign in
      </Link>
      <Link
        id="wd-signup-link"
        className="text-primary text-decoration-none"
        href="/account/signup"
      >
        Sign up
      </Link>
    </div>
  );
}
