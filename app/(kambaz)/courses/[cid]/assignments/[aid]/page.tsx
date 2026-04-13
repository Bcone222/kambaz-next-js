"use client";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import {
  addAssignment,
  updateAssignment,
  setAssignmentsForCourse,
} from "../reducer";
import { useState, useEffect } from "react";
import { FormControl, Button } from "react-bootstrap";
import * as client from "../../../client";

const CAN_EDIT_ASSIGNMENTS_ROLES = ["FACULTY", "ADMIN", "TA"];

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
  const canEditAssignments =
    !!currentUser && CAN_EDIT_ASSIGNMENTS_ROLES.includes(currentUser.role);

  const isNew = aid === "new";
  const existingAssignment = assignments.find((a: any) => a._id === aid);
  const [courseAssignmentsLoaded, setCourseAssignmentsLoaded] = useState(false);

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
    if (!cid) return;
    let ignore = false;
    setCourseAssignmentsLoaded(isNew);
    (async () => {
      const data = await client.findAssignmentsForCourse(cid as string);
      if (ignore) return;
      dispatch(
        setAssignmentsForCourse({
          courseId: cid as string,
          assignments: data,
        })
      );
      if (aid !== "new" && !data.some((a: any) => a._id === aid)) {
        router.push(`/courses/${cid}/assignments`);
        return;
      }
      setCourseAssignmentsLoaded(true);
    })();
    return () => {
      ignore = true;
    };
  }, [cid, aid, dispatch, router, isNew]);

  useEffect(() => {
    if (isNew && !canEditAssignments) {
      router.replace(`/courses/${cid}/assignments`);
    }
  }, [isNew, canEditAssignments, cid, router]);

  useEffect(() => {
    if (!isNew && existingAssignment) {
      setAssignment(existingAssignment);
    }
  }, [existingAssignment, isNew]);

  const handleSave = async () => {
    if (!canEditAssignments) return;
    if (isNew) {
      const { _id: _drop, ...createPayload } = assignment;
      void _drop;
      const created = await client.createAssignmentForCourse(
        cid as string,
        createPayload
      );
      dispatch(addAssignment({ ...created, course: cid }));
    } else {
      await client.updateAssignmentOnServer(cid as string, assignment);
      dispatch(updateAssignment({ ...assignment, course: cid }));
    }
    router.push(`/courses/${cid}/assignments`);
  };

  const handleCancel = () => {
    router.push(`/courses/${cid}/assignments`);
  };

  if (!isNew && !courseAssignmentsLoaded) {
    return <div className="p-3">Loading assignment…</div>;
  }

  return (
    <div id="wd-assignments-editor" className="p-3">
      <div className="mb-3">
        <label htmlFor="wd-name" className="form-label">
          Assignment Name
        </label>
        <FormControl
          id="wd-name"
          value={assignment.title}
          readOnly={!canEditAssignments}
          disabled={!canEditAssignments}
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
          readOnly={!canEditAssignments}
          disabled={!canEditAssignments}
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
            readOnly={!canEditAssignments}
            disabled={!canEditAssignments}
            onChange={(e) =>
              setAssignment({
                ...assignment,
                points: parseInt(e.target.value, 10) || 0,
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
              readOnly={!canEditAssignments}
              disabled={!canEditAssignments}
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
                readOnly={!canEditAssignments}
                disabled={!canEditAssignments}
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
                readOnly={!canEditAssignments}
                disabled={!canEditAssignments}
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
        <Button variant="secondary" className="me-2" onClick={handleCancel}>
          {canEditAssignments ? "Cancel" : "Back"}
        </Button>
        {canEditAssignments && (
          <Button variant="danger" onClick={handleSave}>
            Save
          </Button>
        )}
      </div>
    </div>
  );
}
