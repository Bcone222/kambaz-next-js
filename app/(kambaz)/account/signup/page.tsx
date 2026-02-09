import Link from "next/link";
import { FormControl, Button } from "react-bootstrap";

export default function Signup() {
  return (
    <div id="wd-signup-screen" className="p-4">
      <h1>Sign up</h1>
      <FormControl
        className="mb-2 wd-username"
        placeholder="username"
      />
      <FormControl
        className="mb-2 wd-password"
        placeholder="password"
        type="password"
      />
      <FormControl
        className="mb-2 wd-password-verify"
        placeholder="verify password"
        type="password"
      />
      <Link className="btn btn-primary w-100 mb-2" href="/account/profile">
        Sign up
      </Link>
      <Link className="text-primary text-decoration-none" href="/account/signin">
        Sign in
      </Link>
    </div>
  );
}
