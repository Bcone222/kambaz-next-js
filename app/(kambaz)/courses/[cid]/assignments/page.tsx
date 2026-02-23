"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FormControl, InputGroup, Button } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { FaSearch, FaPlus, FaEllipsisV } from "react-icons/fa";
import { BsGripVertical, BsFileEarmarkText } from "react-icons/bs";
import GreenCheckmark from "../modules/GreenCheckmark";
import * as db from "../../../database";
export default function Assignments() {
  const { cid } = useParams();
  const assignments = db.assignments.filter((a: any) => a.course === cid);
  return (
    <div id="wd-assignments" className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <InputGroup style={{ width: "300px" }}>
          <InputGroupText><FaSearch /></InputGroupText>
          <FormControl placeholder="Search..." id="wd-search-assignment" />
        </InputGroup>
        <div>
          <Button id="wd-add-assignment-group" variant="secondary" className="me-2">
            <FaPlus className="me-1" />Group
          </Button>
          <Button id="wd-add-assignment" variant="danger">
            <FaPlus className="me-1" />Assignment
          </Button>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center p-3 mb-0 bg-light border rounded-top">
        <div className="d-flex align-items-center fw-bold">
          <BsGripVertical className="me-2 fs-4 text-secondary" />
          <span>&#9660;</span>
          <h3 id="wd-assignments-title" className="mb-0 fw-bold ms-2 fs-5">
            ASSIGNMENTS
          </h3>
        </div>
        <div className="d-flex align-items-center">
          <span className="border rounded-pill px-3 py-1 me-2 small">40% of Total</span>
          <Button variant="light" size="sm" className="me-1 border"><FaPlus /></Button>
          <Button variant="light" size="sm" className="border"><FaEllipsisV /></Button>
        </div>
      </div>
      <ul className="list-unstyled mb-0 border-start border-success border-5" id="wd-assignment-list">
          {assignments.map((assignment: any) => (
            <li 
              key={assignment._id}
              className="wd-assignment-list-item d-flex align-items-center p-3 bg-white border-bottom border-light-subtle"
            >
              <BsGripVertical className="me-2 fs-4 text-secondary flex-shrink-0" />
              <BsFileEarmarkText className="me-3 fs-4 text-success flex-shrink-0" />
              <div className="flex-grow-1">
                <Link
                  href={`/courses/${cid}/assignments/${assignment._id}`}
                  className="wd-assignment-link text-decoration-none fw-bold text-dark"
                >
                  {assignment.title}
                </Link>
                <div className="text-secondary small">
                  Multiple Modules | <b>Not available until</b> {assignment.availableFrom} at 12:00am |{" "}
                  <b>Due</b> {assignment.dueDate} at 11:59pm | {assignment.points} pts
                </div>
              </div>
              <div className="d-flex align-items-center ms-3 flex-shrink-0">
                <GreenCheckmark />
                <FaEllipsisV className="ms-2 text-secondary" />
              </div>
            </li>
          ))}
        </ul>
    </div>
  );
}
