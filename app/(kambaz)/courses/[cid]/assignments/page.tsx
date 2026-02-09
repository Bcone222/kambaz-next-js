"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FormControl, InputGroup, Button } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { FaSearch, FaPlus, FaEllipsisV } from "react-icons/fa";
import GreenCheckmark from "../modules/GreenCheckmark";

export default function Assignments() {
  const params = useParams();
  const cid = params?.cid as string;

  return (
    <div id="wd-assignments" className="p-3">
      <div className="d-flex justify-content-end mb-3">
        <InputGroup className="w-25 me-2">
          <InputGroupText>
            <FaSearch />
          </InputGroupText>
          <FormControl
            placeholder="Search..."
            id="wd-search-assignment"
          />
        </InputGroup>
        <Button
          id="wd-add-assignment-group"
          variant="secondary"
          className="me-2"
        >
          <FaPlus className="me-1" />
          Group
        </Button>
        <Button id="wd-add-assignment" variant="danger">
          <FaPlus className="me-1" />
          Assignment
        </Button>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 id="wd-assignments-title" className="mb-0 fw-bold">
          ASSIGNMENTS 40% of Total
        </h3>
        <div>
          <Button variant="secondary" size="sm" className="me-2">
            <FaPlus />
          </Button>
          <Button variant="secondary" size="sm">
            <FaEllipsisV />
          </Button>
        </div>
      </div>

      <ul id="wd-assignment-list" className="list-unstyled">
        <li className="wd-assignment-list-item mb-3 p-3 border-start border-success border-5 position-relative">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <Link
                href={`/courses/${cid}/assignments/123`}
                className="wd-assignment-link text-decoration-none fw-bold fs-5 text-primary"
              >
                A1
              </Link>
              <br />
              <span className="text-secondary">
                Multiple Modules | <b>Not available until</b> May 6 at 12:00am |{" "}
                <b>Due</b> May 13 at 11:59pm | 100 pts
              </span>
            </div>
            <div className="d-flex align-items-center">
              <GreenCheckmark />
              <FaEllipsisV className="me-2" />
            </div>
          </div>
        </li>

        <li className="wd-assignment-list-item mb-3 p-3 border-start border-success border-5 position-relative">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <Link
                href={`/courses/${cid}/assignments/234`}
                className="wd-assignment-link text-decoration-none fw-bold fs-5 text-primary"
              >
                A2
              </Link>
              <br />
              <span className="text-secondary">
                Multiple Modules | <b>Not available until</b> May 13 at 12:00am |{" "}
                <b>Due</b> May 20 at 11:59pm | 100 pts
              </span>
            </div>
            <div className="d-flex align-items-center">
              <GreenCheckmark />
              <FaEllipsisV className="me-2" />
            </div>
          </div>
        </li>

        <li className="wd-assignment-list-item mb-3 p-3 border-start border-success border-5 position-relative">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <Link
                href={`/courses/${cid}/assignments/345`}
                className="wd-assignment-link text-decoration-none fw-bold fs-5 text-primary"
              >
                A3
              </Link>
              <br />
              <span className="text-secondary">
                Multiple Modules | <b>Not available until</b> May 20 at 12:00am |{" "}
                <b>Due</b> May 27 at 11:59pm | 100 pts
              </span>
            </div>
            <div className="d-flex align-items-center">
              <GreenCheckmark />
              <FaEllipsisV className="me-2" />
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}
