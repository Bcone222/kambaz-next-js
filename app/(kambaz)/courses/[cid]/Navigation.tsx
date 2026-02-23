"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

export default function CourseNavigation() {
  const pathname = usePathname();
  const params = useParams();
  const cid = params?.cid as string;

  const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];

  const getHref = (link: string) => {
    if (link === "People") {
      return `/courses/${cid}/people/table`;
    }
    return `/courses/${cid}/${link.toLowerCase()}`;
  };

  const getId = (link: string) => {
    return `wd-course-${link.toLowerCase()}-link`;
  };

  const isActive = (link: string) => {
    const href = getHref(link);
    if (link === "Home") {
      return pathname === href || pathname === `/courses/${cid}`;
    }
    if (link === "People") {
      return pathname?.includes("/people");
    }
    return pathname?.includes(`/${link.toLowerCase()}`);
  };

  return (
    <div id="wd-courses-navigation" className="me-3">
      {links.map((link) => {
        const active = isActive(link);
        return (
          <div key={link} className="py-2">
            <Link
              href={getHref(link)}
              id={getId(link)}
              className={`text-decoration-none ${active ? "text-dark fw-bold" : "text-danger"}`}
            >
              {link}
            </Link>
            <br />
          </div>
        );
      })}
    </div>
  );
}
