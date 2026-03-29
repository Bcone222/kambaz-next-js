"use client";

import React, { useState } from "react";
import { FormCheck, FormControl } from "react-bootstrap";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const ASSIGNMENT_API_URL = `${HTTP_SERVER}/lab5/assignment`;
const MODULE_API_URL = `${HTTP_SERVER}/lab5/module`;

export default function WorkingWithObjects() {
  const [assignment, setAssignment] = useState({
    id: 1,
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10",
    completed: false,
    score: 0,
  });

  const [module, setModule] = useState({
    id: "M101",
    name: "Introduction to Node",
    description: "Basic Node.js concepts",
    course: "CS5610",
  });

  return (
    <div>
      <h3 id="wd-working-with-objects">Working With Objects</h3>

      <h4>Retrieving Objects</h4>
      <a
        id="wd-retrieve-assignments"
        className="btn btn-primary"
        href={`${HTTP_SERVER}/lab5/assignment`}
      >
        Get Assignment
      </a>
      <hr />

      <h4>Retrieving Properties</h4>
      <a
        id="wd-retrieve-assignment-title"
        className="btn btn-primary"
        href={`${HTTP_SERVER}/lab5/assignment/title`}
      >
        Get Title
      </a>
      <hr />

      <h4>Modifying Properties</h4>
      <div className="clearfix mb-2">
        <a
          id="wd-update-assignment-title"
          className="btn btn-primary float-end"
          href={`${ASSIGNMENT_API_URL}/title/${encodeURIComponent(assignment.title)}`}
        >
          Update Title
        </a>
        <FormControl
          className="w-75"
          id="wd-assignment-title"
          value={assignment.title}
          onChange={(e) =>
            setAssignment({ ...assignment, title: e.target.value })
          }
        />
      </div>
      <hr />

      <h4>Retrieving Module</h4>
      <a
        id="wd-retrieve-module"
        className="btn btn-primary me-2"
        href={`${MODULE_API_URL}`}
      >
        Get Module
      </a>
      <a
        id="wd-retrieve-module-name"
        className="btn btn-primary"
        href={`${MODULE_API_URL}/name`}
      >
        Get Module Name
      </a>
      <hr />

      <h4>Modifying Module</h4>
      <div className="d-flex align-items-center gap-2 mb-3">
        <FormControl
          className="flex-grow-1"
          id="wd-module-name"
          value={module.name}
          onChange={(e) => setModule({ ...module, name: e.target.value })}
        />
        <a
          id="wd-update-module-name"
          className="btn btn-primary flex-shrink-0"
          href={`${MODULE_API_URL}/name/${encodeURIComponent(module.name)}`}
        >
          Update Module Name
        </a>
      </div>
      <div className="d-flex align-items-start gap-2 mb-2">
        <FormControl
          className="flex-grow-1"
          id="wd-module-description"
          as="textarea"
          rows={2}
          value={module.description}
          onChange={(e) =>
            setModule({ ...module, description: e.target.value })
          }
        />
        <a
          id="wd-update-module-description"
          className="btn btn-primary flex-shrink-0 align-self-start"
          href={`${MODULE_API_URL}/description/${encodeURIComponent(module.description)}`}
        >
          Update Module Description
        </a>
      </div>
      <hr />

      <h4>Assignment Score and Completion</h4>
      <div className="clearfix mb-2">
        <a
          id="wd-update-assignment-score"
          className="btn btn-primary float-end"
          href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}
        >
          Update Score
        </a>
        <FormControl
          className="w-75"
          id="wd-assignment-score"
          type="number"
          value={assignment.score}
          onChange={(e) =>
            setAssignment({
              ...assignment,
              score: parseInt(e.target.value, 10) || 0,
            })
          }
        />
      </div>
      <div className="clearfix mb-2">
        <a
          id="wd-update-assignment-completed"
          className="btn btn-primary float-end"
          href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}
        >
          Update Completed
        </a>
        <FormCheck
          className="mb-0"
          id="wd-assignment-completed"
          type="checkbox"
          label="Completed"
          checked={assignment.completed}
          onChange={(e) =>
            setAssignment({ ...assignment, completed: e.target.checked })
          }
        />
      </div>
      <hr />
    </div>
  );
}
