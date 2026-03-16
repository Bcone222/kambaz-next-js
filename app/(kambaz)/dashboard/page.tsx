"use client";
import { useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse } from "../courses/reducer";
import { enroll, unenroll } from "../enrollments/reducer";
import { RootState } from "../store";
import { FormControl, Button, Row, Col, Card } from "react-bootstrap";

export default function Dashboard() {
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);
  const dispatch = useDispatch();
  const [showAllCourses, setShowAllCourses] = useState(false);
  const isFaculty = currentUser?.role === "FACULTY";

  const [course, setCourse] = useState<any>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description",
  });

  const displayedCourses = courses.filter((c: any) => {
    if (showAllCourses) return true;
    if (!currentUser) return true;
    return enrollments.some(
      (enrollment: any) =>
        enrollment.user === currentUser._id &&
        enrollment.course === c._id
    );
  });

  return (
    <div className="p-4" id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <Button
        className="float-end"
        variant="primary"
        onClick={() => setShowAllCourses(!showAllCourses)}
      >
        Enrollments
      </Button>
      <hr />
      {isFaculty && (
        <>
          <h5>
            New Course
            <Button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={() => dispatch(addNewCourse(course))}
            >
              Add
            </Button>
            <Button
              className="btn btn-warning float-end me-2"
              onClick={() => dispatch(updateCourse(course))}
              id="wd-update-course-click"
            >
              Update
            </Button>
          </h5>
          <br />
          <FormControl
            value={course.name}
            className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <FormControl
            as="textarea"
            value={course.description}
            rows={3}
            onChange={(e) => setCourse({ ...course, description: e.target.value })}
          />
          <hr />
        </>
      )}
      <h2 id="wd-dashboard-published">
        Published Courses ({displayedCourses.length})
      </h2>
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {displayedCourses.map((c: any) => {
              const isEnrolled = enrollments.some(
                (e: any) => e.user === currentUser?._id && e.course === c._id
              );
              return (
                <Col key={c._id} className="wd-dashboard-course" style={{ width: "300px" }}>
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
                            onClick={(event) => {
                              event.preventDefault();
                              dispatch(deleteCourse(c._id));
                            }}
                            className="btn btn-danger float-end me-2"
                            id="wd-delete-course-click"
                          >
                            Delete
                          </button>
                        </>
                      )}
                      {showAllCourses && currentUser && (
                        isEnrolled ? (
                          <Button
                            variant="danger"
                            className="mt-2 w-100"
                            onClick={(e) => {
                              e.preventDefault();
                              dispatch(unenroll({ userId: currentUser._id, courseId: c._id }));
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
                              dispatch(enroll({ userId: currentUser._id, courseId: c._id }));
                            }}
                          >
                            Enroll
                          </Button>
                        )
                      )}
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
