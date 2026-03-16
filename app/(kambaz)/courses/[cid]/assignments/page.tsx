"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { deleteAssignment } from "./reducer";
import { FormControl, InputGroup, Button, Dropdown } from "react-bootstrap";
import { FaSearch, FaPlus, FaEllipsisV } from "react-icons/fa";
import { BsGripVertical, BsFileEarmarkText } from "react-icons/bs";
import GreenCheckmark from "../modules/GreenCheckmark";
import { useState } from "react";

const CAN_EDIT_ASSIGNMENTS_ROLES = ["FACULTY", "ADMIN", "TA"];

export default function Assignments() {
  const { cid } = useParams();
  const { assignments } = useSelector(
    (state: RootState) => state.assignmentsReducer
  );
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const canEditAssignments =
    currentUser && CAN_EDIT_ASSIGNMENTS_ROLES.includes(currentUser.role);
  const dispatch = useDispatch();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null);

  const courseAssignments = assignments.filter(
    (a: any) => a.course === cid
  );

  const handleDeleteClick = (assignmentId: string) => {
    setAssignmentToDelete(assignmentId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (assignmentToDelete) {
      dispatch(deleteAssignment(assignmentToDelete));
    }
    setShowDeleteDialog(false);
    setAssignmentToDelete(null);
  };

  return (
    <div id="wd-assignments" className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <InputGroup style={{ width: "300px" }}>
          <InputGroup.Text><FaSearch /></InputGroup.Text>
          <FormControl placeholder="Search..." id="wd-search-assignment" />
        </InputGroup>
        <div>
          {canEditAssignments && (
            <>
              <Button id="wd-add-assignment-group" variant="secondary" className="me-2">
                <FaPlus className="me-1" />Group
              </Button>
              <Link href={`/courses/${cid}/assignments/new`}>
                <Button id="wd-add-assignment" variant="danger">
                  <FaPlus className="me-1" />Assignment
                </Button>
              </Link>
            </>
          )}
          <Button variant="light" size="sm" className="ms-1 border">
            <FaEllipsisV />
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
        {courseAssignments.map((assignment: any) => (
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
                Multiple Modules | <b>Not available until</b> {assignment.availableFrom || "—"} at 12:00am |{" "}
                <b>Due</b> {assignment.dueDate || "—"} at 11:59pm | {assignment.points ?? 0} pts
              </div>
            </div>
            <div className="d-flex align-items-center ms-3 flex-shrink-0">
              <GreenCheckmark />
              {canEditAssignments && (
                <Dropdown align="end" className="ms-2">
                  <Dropdown.Toggle
                    variant="light"
                    size="sm"
                    className="p-0 border-0 text-secondary"
                    id={`wd-assignment-menu-${assignment._id}`}
                  >
                    <FaEllipsisV className="fs-5" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => handleDeleteClick(assignment._id)}
                      className="text-danger"
                    >
                      Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </div>
          </li>
        ))}
      </ul>

      {showDeleteDialog && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Assignment</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteDialog(false)}
                />
              </div>
              <div className="modal-body">
                <p>Are you sure you want to remove this assignment?</p>
              </div>
              <div className="modal-footer">
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </Button>
                <Button variant="danger" onClick={confirmDelete}>
                  Yes, Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
