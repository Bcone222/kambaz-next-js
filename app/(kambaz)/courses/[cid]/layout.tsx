"use client";
import { ReactNode, useState, useEffect } from "react";
import CourseNavigation from "./Navigation";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "../../store";
import { setCourses } from "../reducer";
import { setEnrollments } from "../../enrollments/reducer";
import { findMyCourses } from "../client";
import { fetchMyEnrollments } from "../../account/client";
import { FaAlignJustify } from "react-icons/fa";

export default function CoursesLayout({ children }: { children: ReactNode }) {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const { enrollments } = useSelector(
    (state: RootState) => state.enrollmentsReducer
  );
  const course = courses.find((c: any) => c._id === cid) as
    | { _id: string; name: string }
    | undefined;
  const [showNav, setShowNav] = useState(true);
  const [loading, setLoading] = useState(true);

  const isEnrolled =
    !currentUser ||
    enrollments.some(
      (e: any) => e.user === currentUser._id && e.course === cid
    );

  useEffect(() => {
    let ignore = false;
    async function loadCourseData() {
      if (!cid) {
        if (!ignore) setLoading(false);
        return;
      }
      if (!currentUser) {
        if (!ignore) setLoading(false);
        return;
      }
      if (!ignore) setLoading(true);
      try {
        const [mine, enr] = await Promise.all([
          findMyCourses(),
          fetchMyEnrollments(),
        ]);
        if (!ignore) {
          dispatch(setCourses(mine));
          dispatch(setEnrollments(enr));
        }
      } catch {
      }
      if (!ignore) setLoading(false);
    }
    void loadCourseData();
    return () => {
      ignore = true;
    };
  }, [cid, currentUser, dispatch]);

  useEffect(() => {
    if (loading) return;
    if (!course) {
      router.push("/dashboard");
      return;
    }
    if (currentUser && !isEnrolled) {
      router.push("/dashboard");
    }
  }, [loading, course, currentUser, isEnrolled, router]);

  if (loading) {
    return <div className="p-3">Loading...</div>;
  }

  if (!course || (currentUser && !isEnrolled)) {
    return null;
  }

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
