"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setCourses } from "../courses/reducer";
import { setEnrollments } from "../enrollments/reducer";
import { RootState } from "../store";
import { FormControl, Button, Row, Col, Card } from "react-bootstrap";
import * as client from "../courses/client";
import * as enrollClient from "../account/client";

type Course = {
  _id: string;
  name: string;
  number?: string;
  startDate?: string;
  endDate?: string;
  image?: string;
  description?: string;
};

export default function Dashboard() {
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );
  const { enrollments } = useSelector(
    (state: RootState) => state.enrollmentsReducer,
  );
  const dispatch = useDispatch();
  const [showAllCourses, setShowAllCourses] = useState(false);
  const isFaculty = currentUser?.role === "FACULTY";

  const [course, setCourse] = useState<Course>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description",
  });

  const loadMyCoursesAndEnrollments = useCallback(async () => {
    if (!currentUser) return;
    const mine = (await client.findMyCourses()) as Course[];
    dispatch(setCourses(mine));
    const enr = await enrollClient.fetchMyEnrollments();
    dispatch(setEnrollments(enr));
  }, [currentUser, dispatch]);

  useEffect(() => {
    loadMyCoursesAndEnrollments();
  }, [loadMyCoursesAndEnrollments]);

  const toggleEnrollmentsView = async () => {
    const next = !showAllCourses;
    setShowAllCourses(next);
    if (next) {
      const all = (await client.fetchAllCourses()) as Course[];
      dispatch(setCourses(all));
    } else {
      await loadMyCoursesAndEnrollments();
    }
  };

  const list = courses as Course[];

  const onAddNewCourse = async () => {
    const newCourse = (await client.createCourse(course)) as Course;
    dispatch(setCourses([...list, newCourse]));
  };

  const onDeleteCourse = async (courseId: string) => {
    await client.deleteCourse(courseId);
    dispatch(setCourses(list.filter((c) => c._id !== courseId)));
  };

  const onUpdateCourse = async () => {
    await client.updateCourse(course);
    dispatch(setCourses(list.map((c) => (c._id === course._id ? course : c))));
  };

  const handleEnroll = async (courseId: string) => {
    await enrollClient.enrollInCourse(courseId);
    const enr = await enrollClient.fetchMyEnrollments();
    dispatch(setEnrollments(enr));
  };

  const handleUnenroll = async (courseId: string) => {
    await enrollClient.unenrollFromCourse(courseId);
    const enr = await enrollClient.fetchMyEnrollments();
    dispatch(setEnrollments(enr));
  };

  return (
    <div className="p-4" id="wd-dashboard">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
        <h1 id="wd-dashboard-title" className="mb-0">
          Dashboard
        </h1>
        {!isFaculty && (
          <Button variant="primary" onClick={toggleEnrollmentsView}>
            Enrollments
          </Button>
        )}
      </div>
      <hr />
      {isFaculty && (
        <>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-2">
            <h5 className="mb-0">New Course</h5>
            <div className="d-flex align-items-center gap-2 flex-shrink-0">
              <Button
                variant="warning"
                id="wd-update-course-click"
                onClick={() => onUpdateCourse()}
              >
                Update
              </Button>
              <Button
                variant="primary"
                id="wd-add-new-course-click"
                onClick={() => onAddNewCourse()}
              >
                Add
              </Button>
              <Button variant="primary" onClick={toggleEnrollmentsView}>
                Enrollments
              </Button>
            </div>
          </div>
          <FormControl
            value={course.name}
            className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <FormControl
            as="textarea"
            value={course.description}
            rows={3}
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
          />
          <hr />
        </>
      )}
      <h2 id="wd-dashboard-published">Published Courses ({list.length})</h2>
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {list.map((c) => {
            const enrList = enrollments as { user: string; course: string }[];
            const isEnrolled = enrList.some(
              (e) => e.user === currentUser?._id && e.course === c._id,
            );
            return (
              <Col
                key={c._id}
                className="wd-dashboard-course"
                style={{ width: "300px" }}
              >
                <Card>
                  <Card.Img
                    variant="top"
                    src={c.image || "/images/reactjs.jpg"}
                    width="100%"
                    height={160}
                  />
                  <Card.Body>
                    <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {c.name}
                    </Card.Title>
                    <Card.Text
                      className="wd-dashboard-course-description overflow-hidden"
                      style={{ maxHeight: 100 }}
                    >
                      {c.description}
                    </Card.Text>
                    {(!showAllCourses || isEnrolled) && (
                      <Link href={`/courses/${c._id}/home`}>
                        <Button variant="primary">Go</Button>
                      </Link>
                    )}
                    {isFaculty && (
                      <>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            setCourse(c);
                          }}
                          className="btn btn-warning me-2 float-end"
                          id="wd-edit-course-click"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            onDeleteCourse(c._id);
                          }}
                          className="btn btn-danger float-end me-2"
                          id="wd-delete-course-click"
                        >
                          Delete
                        </button>
                      </>
                    )}
                    {showAllCourses &&
                      currentUser &&
                      (isEnrolled ? (
                        <Button
                          variant="danger"
                          className="mt-2 w-100"
                          onClick={(e) => {
                            e.preventDefault();
                            handleUnenroll(c._id);
                          }}
                        >
                          Unenroll
                        </Button>
                      ) : (
                        <Button
                          variant="success"
                          className="mt-2 w-100"
                          onClick={(e) => {
                            e.preventDefault();
                            handleEnroll(c._id);
                          }}
                        >
                          Enroll
                        </Button>
                      ))}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}
