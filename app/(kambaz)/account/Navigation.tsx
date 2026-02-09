"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Nav, NavItem, NavLink } from "react-bootstrap";

export default function AccountNavigation() {
  const pathname = usePathname();
  
  return (
    <div id="wd-account-navigation" className="me-3">
      <Nav className="flex-column">
        <NavItem>
          <NavLink 
            as={Link} 
            href="/account/signin" 
            id="wd-account-signin-link"
            className={pathname === "/account/signin" ? "text-dark fw-bold" : "text-danger"}
          >
            Signin
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink 
            as={Link} 
            href="/account/signup" 
            id="wd-account-signup-link"
            className={pathname === "/account/signup" ? "text-dark fw-bold" : "text-danger"}
          >
            Signup
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink 
            as={Link} 
            href="/account/profile" 
            id="wd-account-profile-link"
            className={pathname === "/account/profile" ? "text-dark fw-bold" : "text-danger"}
          >
            Profile
          </NavLink>
        </NavItem>
      </Nav>
    </div>
  );
}
