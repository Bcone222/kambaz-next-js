"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

export default function CourseNavigation() {
  const pathname = usePathname();
  const params = useParams();
  const cid = params?.cid as string;

  const links = [
    { href: `/courses/${cid}/home`, id: "wd-course-home-link", label: "Home" },
    { href: `/courses/${cid}/modules`, id: "wd-course-modules-link", label: "Modules" },
    { href: `/courses/${cid}/piazza`, id: "wd-course-piazza-link", label: "Piazza" },
    { href: `/courses/${cid}/zoom`, id: "wd-course-zoom-link", label: "Zoom" },
    { href: `/courses/${cid}/assignments`, id: "wd-course-assignments-link", label: "Assignments" },
    { href: `/courses/${cid}/quizzes`, id: "wd-course-quizzes-link", label: "Quizzes" },
    { href: `/courses/${cid}/grades`, id: "wd-course-grades-link", label: "Grades" },
    { href: `/courses/${cid}/people/table`, id: "wd-course-people-link", label: "People" },
  ];

  return (
    <div id="wd-courses-navigation" className="me-3">
      {links.map((link) => {
        const isActive = pathname === link.href || 
          (link.href.includes("/home") && pathname === `/courses/${cid}`) ||
          (link.href.includes("/modules") && pathname?.includes("/modules")) ||
          (link.href.includes("/assignments") && pathname?.includes("/assignments")) ||
          (link.href.includes("/quizzes") && pathname?.includes("/quizzes")) ||
          (link.href.includes("/grades") && pathname?.includes("/grades"));
        
        return (
          <div key={link.id}>
            <Link
              href={link.href}
              id={link.id}
              className={`text-decoration-none ${isActive ? "text-dark fw-bold" : "text-danger"}`}
            >
              {link.label}
            </Link>
            <br />
          </div>
        );
      })}
    </div>
  );
}
