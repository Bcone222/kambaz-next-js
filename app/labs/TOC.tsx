"use client";

import Link from "next/link";
import { Nav, NavItem, NavLink } from "react-bootstrap";

export default function TOC() {
  return (
    <>
      <h1>Brooklyn Cone</h1>
      <h2>Labs</h2>

      <Nav variant="pills">
        <NavItem>
          <NavLink as={Link} href="/labs" id="wd-labs-home-link">
            Labs
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink as={Link} href="/labs/lab1" id="wd-lab1-link">
            Lab 1
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink as={Link} href="/labs/lab2" id="wd-lab2-link">
            Lab 2
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink as={Link} href="/labs/lab3" id="wd-lab3-link">
            Lab 3
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink as={Link} href="/" id="wd-kambaz-link">
            Kambaz
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink as={Link} href="https://github.com/Bcone222/kambaz-next-js" id="wd-github">
            My GitHub
          </NavLink>
        </NavItem>
      </Nav>
    </>
  );
}
