"use client";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { addAssignment, updateAssignment } from "../reducer";
import { useState, useEffect } from "react";
import { FormControl, Button } from "react-bootstrap";

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { assignments } = useSelector(
    (state: RootState) => state.assignmentsReducer
  );
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const isFaculty = ["FACULTY", "ADMIN", "TA"].includes(currentUser?.role);

  const isNew = aid === "new";
  const existingAssignment = assignments.find((a: any) => a._id === aid);

  const [assignment, setAssignment] = useState<any>({
    title: "New Assignment",
    description: "New Assignment Description",
    points: 100,
    dueDate: "",
    availableFrom: "",
    availableUntil: "",
    course: cid,
  });

  useEffect(() => {
    if (!isNew && existingAssignment) {
      setAssignment(existingAssignment);
    }
  }, [existingAssignment, isNew]);

  const handleSave = () => {
    if (isNew) {
      dispatch(addAssignment({ ...assignment, course: cid }));
    } else {
      dispatch(updateAssignment(assignment));
    }
    router.push(`/courses/${cid}/assignments`);
  };

  const handleCancel = () => {
    router.push(`/courses/${cid}/assignments`);
  };

  return (
    <div id="wd-assignments-editor" className="p-3">
      <div className="mb-3">
        <label htmlFor="wd-name" className="form-label">
          Assignment Name
        </label>
        <FormControl
          id="wd-name"
          value={assignment.title}
          onChange={(e) =>
            setAssignment({ ...assignment, title: e.target.value })
          }
        />
      </div>

      <div className="mb-3">
        <label htmlFor="wd-description" className="form-label">
          Description
        </label>
        <FormControl
          as="textarea"
          id="wd-description"
          rows={4}
          value={assignment.description}
          onChange={(e) =>
            setAssignment({ ...assignment, description: e.target.value })
          }
        />
      </div>

      <div className="row mb-3">
        <div className="col-md-3 text-end">
          <label htmlFor="wd-points" className="form-label">
            Points
          </label>
        </div>
        <div className="col-md-9">
          <FormControl
            id="wd-points"
            type="number"
            value={assignment.points}
            onChange={(e) =>
              setAssignment({
                ...assignment,
                points: parseInt(e.target.value) || 0,
              })
            }
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-3 text-end">
          <label className="form-label">Assign</label>
        </div>
        <div className="col-md-9 border rounded p-3">
          <div className="mb-3">
            <label htmlFor="wd-due-date" className="form-label">
              Due
            </label>
            <FormControl
              id="wd-due-date"
              type="date"
              value={assignment.dueDate || ""}
              disabled={!isFaculty}
              onChange={(e) =>
                setAssignment({ ...assignment, dueDate: e.target.value })
              }
            />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="wd-available-from" className="form-label">
                Available from
              </label>
              <FormControl
                id="wd-available-from"
                type="date"
                value={assignment.availableFrom || ""}
                disabled={!isFaculty}
                onChange={(e) =>
                  setAssignment({
                    ...assignment,
                    availableFrom: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="wd-available-until" className="form-label">
                Until
              </label>
              <FormControl
                id="wd-available-until"
                type="date"
                value={assignment.availableUntil || ""}
                disabled={!isFaculty}
                onChange={(e) =>
                  setAssignment({
                    ...assignment,
                    availableUntil: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>

      <hr />
      <div className="d-flex justify-content-end">
        <Button
          variant="secondary"
          className="me-2"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button variant="danger" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}
