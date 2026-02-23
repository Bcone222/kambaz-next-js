"use client";
import React from "react";
import { usePathname } from "next/navigation";
export default function Breadcrumb({ course }: { course: { name: string } | undefined }) {
  const pathname = usePathname();
  const lastSegment = pathname.split("/").pop() ?? "";
  let displayText = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  if (pathname.includes("/people")) {
    displayText = "People";
  }
  return (
    <span>
      {course?.name} &gt; {displayText}
    </span>
  );
}
