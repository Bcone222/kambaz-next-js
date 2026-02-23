"use client";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ListGroup, ListGroupItem } from "react-bootstrap";
export default function KambazNavigation() {
  const pathname = usePathname();
  const links = [
    { label: "Dashboard", path: "/dashboard", icon: AiOutlineDashboard },
    { label: "Courses",   path: "/dashboard", icon: LiaBookSolid },
    { label: "Calendar",  path: "/calendar",  icon: IoCalendarOutline },
    { label: "Inbox",     path: "/inbox",     icon: FaInbox },
    { label: "Labs",      path: "/labs",      icon: LiaCogSolid },
  ];
  return (
    <ListGroup
      id="wd-kambaz-navigation"
      style={{ width: 120 }}
      className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2"
    >
      <ListGroupItem
        id="wd-neu-link"
        target="_blank"
        href="https://www.northeastern.edu/"
        action
        className="bg-black border-0 text-center"
      >
        <img src="/images/NEUlogo.png" width="75px" alt="NEU" className="wd-neu-logo-red" />
      </ListGroupItem>
      <ListGroupItem
        as={Link}
        href="/account"
        className={`text-center border-0 bg-black
          ${pathname?.startsWith("/account") ? "text-danger bg-white" : "text-white bg-black"}`}
      >
        <FaRegCircleUser
          className={`fs-1 ${pathname?.startsWith("/account") ? "text-danger" : "text-white"}`}
        />
        <br />
        Account
      </ListGroupItem>
      {links.map((link) => {
        let isActive = false;
        if (link.label === "Dashboard") {
          isActive = pathname === "/dashboard";
        } else if (link.label === "Courses") {
          isActive = pathname?.includes("courses");
        } else {
          isActive = pathname?.includes(link.label.toLowerCase());
        }
        return (
          <ListGroupItem
            key={link.label}
            as={Link}
            href={link.path}
            className={`bg-black text-center border-0
              ${isActive ? "text-danger bg-white" : "text-white bg-black"}`}
          >
            {link.icon({ className: "fs-1 text-danger" })}
            <br />
            {link.label}
          </ListGroupItem>
        );
      })}
    </ListGroup>
  );
}
