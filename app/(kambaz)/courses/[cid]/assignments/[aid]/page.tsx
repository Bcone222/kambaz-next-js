"use client";

import { Form, FormLabel, FormControl, FormSelect, FormCheck, Button, Row, Col } from "react-bootstrap";

export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor" className="p-4">
      <Form>
        <Form.Group className="mb-3">
          <FormLabel htmlFor="wd-name">Assignment Name</FormLabel>
          <FormControl id="wd-name" defaultValue="A1 - ENV + HTML" />
        </Form.Group>

        <Form.Group className="mb-3">
          <FormLabel htmlFor="wd-description">Description</FormLabel>
          <FormControl
            as="textarea"
            id="wd-description"
            rows={6}
            defaultValue={`The assignment is available online.
Submit a link to the landing page of your Web application running on Vercel.
The landing page should include links to Labs and Kambaz.`}
          />
        </Form.Group>

        <Row className="mb-3">
          <Col sm={3}>
            <FormLabel htmlFor="wd-points" className="text-end d-block">Points</FormLabel>
          </Col>
          <Col sm={9}>
            <FormControl id="wd-points" type="number" defaultValue={100} />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={3}>
            <FormLabel htmlFor="wd-assignment-group" className="text-end d-block">Assignment Group</FormLabel>
          </Col>
          <Col sm={9}>
            <FormSelect id="wd-assignment-group" defaultValue="ASSIGNMENTS">
              <option value="ASSIGNMENTS">ASSIGNMENTS</option>
              <option value="QUIZZES">QUIZZES</option>
              <option value="EXAMS">EXAMS</option>
              <option value="PROJECT">PROJECT</option>
            </FormSelect>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={3}>
            <FormLabel htmlFor="wd-display-grade-as" className="text-end d-block">Display Grade as</FormLabel>
          </Col>
          <Col sm={9}>
            <FormSelect id="wd-display-grade-as" defaultValue="PERCENTAGE">
              <option value="PERCENTAGE">Percentage</option>
              <option value="POINTS">Points</option>
              <option value="LETTER">Letter Grade</option>
            </FormSelect>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={3}>
            <FormLabel htmlFor="wd-submission-type" className="text-end d-block">Submission Type</FormLabel>
          </Col>
          <Col sm={9}>
            <FormSelect id="wd-submission-type" defaultValue="ONLINE">
              <option value="ONLINE">Online</option>
              <option value="ON_PAPER">On Paper</option>
              <option value="NO_SUBMISSION">No Submission</option>
            </FormSelect>

            <div className="mt-3">
              <FormLabel>Online Entry Options</FormLabel>
              <FormCheck
                id="wd-text-entry"
                type="checkbox"
                label="Text Entry"
              />
              <FormCheck
                id="wd-website-url"
                type="checkbox"
                defaultChecked
                label="Website URL"
              />
              <FormCheck
                id="wd-media-recordings"
                type="checkbox"
                label="Media Recordings"
              />
              <FormCheck
                id="wd-student-annotation"
                type="checkbox"
                label="Student Annotation"
              />
              <FormCheck
                id="wd-file-uploads"
                type="checkbox"
                label="File Uploads"
              />
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={3}>
            <FormLabel htmlFor="wd-assign-to" className="text-end d-block">Assign to</FormLabel>
          </Col>
          <Col sm={9}>
            <FormControl id="wd-assign-to" defaultValue="Everyone" />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={3}>
            <FormLabel htmlFor="wd-due-date" className="text-end d-block">Due</FormLabel>
          </Col>
          <Col sm={9}>
            <FormControl id="wd-due-date" type="date" defaultValue="2026-05-13" />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={3}>
            <FormLabel htmlFor="wd-available-from" className="text-end d-block">Available from</FormLabel>
          </Col>
          <Col sm={9}>
            <FormControl
              id="wd-available-from"
              type="date"
              defaultValue="2026-05-06"
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={3}>
            <FormLabel htmlFor="wd-available-until" className="text-end d-block">Until</FormLabel>
          </Col>
          <Col sm={9}>
            <FormControl
              id="wd-available-until"
              type="date"
              defaultValue="2026-05-20"
            />
          </Col>
        </Row>

        <div className="mt-4">
          <Button id="wd-cancel-assignment" variant="secondary" className="me-2">
            Cancel
          </Button>
          <Button id="wd-save-assignment" variant="danger">
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}
  