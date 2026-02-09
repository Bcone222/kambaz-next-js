import Link from "next/link";
import { Row, Col, Card, CardImg, CardBody, CardTitle, Button } from "react-bootstrap";
import { FaEllipsisV } from "react-icons/fa";
import { LuNotebookPen } from "react-icons/lu";

const courses = [
  { id: "1234", code: "CS1234", name: "React JS", description: "Full Stack software developer", isCurrent: true },
  { id: "3500", code: "CS3500", name: "Object Oriented Programming", description: "Object Oriented Programming", isCurrent: true },
  { id: "3650", code: "CS3650", name: "Computer Systems", description: "Computer Systems", isCurrent: true },
  { id: "3800", code: "CS3800", name: "Theory of Computation", description: "Theory of Computation", isCurrent: false },
  { id: "4530", code: "CS4530", name: "Fundamentals of Software Engineering", description: "Fundamentals of Software Engineering", isCurrent: true },
  { id: "3000", code: "DS3000", name: "Foundations of Data Science", description: "Foundations of Data Science", isCurrent: true },
  { id: "4300", code: "IS4300", name: "Human Computer Interaction", description: "Human Computer Interaction", isCurrent: true },
  { id: "4550", code: "CS4550", name: "Web Development", description: "Web Development", isCurrent: true },
];

export default function Dashboard() {
  return (
    <div id="wd-dashboard" className="p-4">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      <h2 id="wd-dashboard-published">Published Courses (12)</h2>
      <hr />
      <Row id="wd-dashboard-courses" className="g-4">
        {courses.map((course) => (
          <Col key={course.id} xs={12} sm={6} md={4} lg={3}>
            <Card className="h-100">
              <div className="position-relative">
                <CardImg
                  variant="top"
                  src="/images/dashboardpic.jpg"
                  style={{ height: "150px", objectFit: "cover" }}
                />
                <Button
                  variant="link"
                  className="position-absolute top-0 end-0 text-white p-2"
                  style={{ zIndex: 1 }}
                >
                  <FaEllipsisV />
                </Button>
              </div>
              <CardBody className="position-relative" style={{ minHeight: "150px", paddingBottom: "50px" }}>
                <CardTitle>
                  <Link href={`/courses/${course.id}`} className="text-decoration-none text-primary">
                    {course.code} {course.name}
                  </Link>
                </CardTitle>
                <p className="text-muted mb-4">
                  <Link href={`/courses/${course.id}`} className="text-decoration-none text-primary">
                    {course.description}
                  </Link>
                </p>
                <Link href={`/courses/${course.id}`} className="position-absolute bottom-0 start-0 p-3">
                  <LuNotebookPen className="fs-4 text-secondary" />
                </Link>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
