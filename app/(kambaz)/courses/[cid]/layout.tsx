"use client";
import { ReactNode, useState, useEffect } from "react";
import CourseNavigation from "./Navigation";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "../../store";
import { FaAlignJustify } from "react-icons/fa";

export default function CoursesLayout({ children }: { children: ReactNode }) {
  const { cid } = useParams();
  const router = useRouter();
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);
  const course = courses.find((c: any) => c._id === cid);
  const [showNav, setShowNav] = useState(true);

  const isEnrolled = !currentUser || enrollments.some(
    (e: any) => e.user === currentUser._id && e.course === cid
  );

  useEffect(() => {
    if (!course) {
      router.push("/dashboard");
      return;
    }
    if (currentUser && !isEnrolled) {
      router.push("/dashboard");
    }
  }, [course, currentUser, isEnrolled, router]);

  if (!course || (currentUser && !isEnrolled)) return null;

  return (
    <div id="wd-courses">
      <h2>
        <FaAlignJustify
          className="me-4 fs-4 mb-1"
          onClick={() => setShowNav(!showNav)}
          style={{ cursor: "pointer" }}
        />
        {course?.name}
      </h2>
      <hr />
      <div className="d-flex">
        {showNav && (
          <div>
            <CourseNavigation />
          </div>
        )}
        <div className="flex-fill">{children}</div>
      </div>
    </div>
  );
}
