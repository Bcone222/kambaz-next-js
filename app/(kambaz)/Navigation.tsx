"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { FaRegCircleUser } from "react-icons/fa6";
import { AiOutlineDashboard } from "react-icons/ai";
import { LiaBookSolid } from "react-icons/lia";
import { IoCalendarOutline } from "react-icons/io5";
import { FaInbox } from "react-icons/fa";
import { LiaCogSolid } from "react-icons/lia";

export default function KambazNavigation() {
  const pathname = usePathname();
  
  return (
    <ListGroup
      className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2"
      style={{ width: 120 }}
      id="wd-kambaz-navigation"
    >
      <ListGroupItem
        className="bg-black border-0 text-center"
        as="a"
        target="_blank"
        href="https://www.northeastern.edu/"
        id="wd-neu-link"
      >
        <img src="/images/NEUlogo.png" width="75px" alt="Northeastern University" className="wd-neu-logo-red" />
      </ListGroupItem>
      <br />
      <ListGroupItem
        className={`border-0 text-center ${
          pathname?.startsWith("/account") ? "bg-white" : "bg-black"
        }`}
      >
        <Link
          href="/account"
          id="wd-account-link"
          className={`text-decoration-none ${
            pathname?.startsWith("/account") ? "text-danger" : "text-white"
          }`}
        >
          <FaRegCircleUser className={`fs-1 ${pathname?.startsWith("/account") ? "text-danger" : "text-white"}`} />
          <br />
          Account
        </Link>
      </ListGroupItem>
      <br />
      <ListGroupItem
        className={`border-0 text-center ${
          pathname === "/dashboard" ? "bg-white" : "bg-black"
        }`}
      >
        <Link
          href="/dashboard"
          id="wd-dashboard-link"
          className={`text-decoration-none ${
            pathname === "/dashboard" ? "text-danger" : "text-white"
          }`}
        >
          <AiOutlineDashboard className="fs-1 text-danger" />
          <br />
          Dashboard
        </Link>
      </ListGroupItem>
      <br />
      <ListGroupItem
        className={`border-0 text-center ${
          pathname?.startsWith("/courses") ? "bg-white" : "bg-black"
        }`}
      >
        <Link
          href="/dashboard"
          id="wd-course-link"
          className={`text-decoration-none ${
            pathname?.startsWith("/courses") ? "text-danger" : "text-white"
          }`}
        >
          <LiaBookSolid className="fs-1 text-danger" />
          <br />
          Courses
        </Link>
      </ListGroupItem>
      <br />
      <ListGroupItem
        className={`border-0 text-center ${
          pathname === "/calendar" ? "bg-white" : "bg-black"
        }`}
      >
        <Link
          href="/calendar"
          id="wd-calendar-link"
          className={`text-decoration-none ${
            pathname === "/calendar" ? "text-danger" : "text-white"
          }`}
        >
          <IoCalendarOutline className="fs-1 text-danger" />
          <br />
          Calendar
        </Link>
      </ListGroupItem>
      <br />
      <ListGroupItem
        className={`border-0 text-center ${
          pathname === "/inbox" ? "bg-white" : "bg-black"
        }`}
      >
        <Link
          href="/inbox"
          id="wd-inbox-link"
          className={`text-decoration-none ${
            pathname === "/inbox" ? "text-danger" : "text-white"
          }`}
        >
          <FaInbox className="fs-1 text-danger" />
          <br />
          Inbox
        </Link>
      </ListGroupItem>
      <br />
      <ListGroupItem
        className={`border-0 text-center ${
          pathname?.startsWith("/labs") ? "bg-white" : "bg-black"
        }`}
      >
        <Link
          href="/labs"
          id="wd-labs-link"
          className={`text-decoration-none ${
            pathname?.startsWith("/labs") ? "text-danger" : "text-white"
          }`}
        >
          <LiaCogSolid className="fs-1 text-danger" />
          <br />
          Labs
        </Link>
      </ListGroupItem>
    </ListGroup>
  );
}
