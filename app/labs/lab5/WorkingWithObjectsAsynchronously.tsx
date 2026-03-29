"use client";

import React, { useEffect, useState } from "react";
import { FormControl } from "react-bootstrap";
import * as client from "./client";

export default function WorkingWithObjectsAsynchronously() {
  const [assignment, setAssignment] = useState<client.Assignment>({
    id: 0,
    title: "",
    description: "",
    due: "",
    completed: false,
    score: 0,
  });

  const fetchAssignment = async () => {
    return await client.fetchAssignment();
  };

  const updateTitle = async (title: string) => {
    const updatedAssignment = await client.updateTitle(title);
    setAssignment(updatedAssignment);
  };

  useEffect(() => {
    let ignore = false;
    fetchAssignment().then((a) => {
      if (!ignore) {
        setAssignment(a);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div id="wd-asynchronous-objects">
      <h3>Working with Objects Asynchronously</h3>
      <h4>Assignment</h4>
      <FormControl
        defaultValue={assignment.title}
        className="mb-2"
        onChange={(e) =>
          setAssignment({ ...assignment, title: e.target.value })
        }
      />
      <FormControl
        rows={3}
        as="textarea"
        defaultValue={assignment.description}
        className="mb-2"
        onChange={(e) =>
          setAssignment({ ...assignment, description: e.target.value })
        }
      />
      <FormControl
        type="date"
        className="mb-2"
        defaultValue={assignment.due}
        onChange={(e) => setAssignment({ ...assignment, due: e.target.value })}
      />
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          id="wd-completed"
          defaultChecked={assignment.completed}
          onChange={(e) =>
            setAssignment({ ...assignment, completed: e.target.checked })
          }
        />
        <label className="form-check-label" htmlFor="wd-completed">
          Completed
        </label>
      </div>

      <button
        type="button"
        className="btn btn-primary me-2"
        onClick={() => updateTitle(assignment.title)}
      >
        Update Title
      </button>

      <pre>{JSON.stringify(assignment, null, 2)}</pre>
      <hr />
    </div>
  );
}

