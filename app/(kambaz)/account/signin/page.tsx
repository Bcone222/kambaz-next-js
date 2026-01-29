import Link from "next/link";

export default function Signin() {
  return (
    <div id="wd-signin-screen">
      <h3>Sign in</h3>
      <input placeholder="username" className="wd-username" /> <br />
      <input placeholder="password" type="password" className="wd-password" /> <br />
      <Link id="wd-signin-btn" href="/dashboard" > Sign in </Link> <br />
      <Link id="wd-signup-link" href="signup"> Sign up </Link>
    </div>
);}
