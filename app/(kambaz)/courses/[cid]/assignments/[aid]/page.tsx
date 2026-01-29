export default function AssignmentEditor() {
    return (
      <div id="wd-assignments-editor">
        <label htmlFor="wd-name">Assignment Name</label>
        <input id="wd-name" defaultValue="A1 - ENV + HTML" />
        <br />
        <br />
  
        <textarea id="wd-description" rows={6} cols={60} defaultValue={
  `The assignment is available online.
  Submit a link to the landing page of your Web application running on Vercel.
  The landing page should include links to Labs and Kambaz.`
        } />
  
        <br />
        <br />
  
        <table>
          <tbody>
            <tr>
              <td align="right" valign="top">
                <label htmlFor="wd-points">Points</label>
              </td>
              <td>
                <input id="wd-points" defaultValue={100} />
              </td>
            </tr>
  
            <tr>
              <td align="right" valign="top">
                <label htmlFor="wd-assignment-group">Assignment Group</label>
              </td>
              <td>
                <select id="wd-assignment-group" defaultValue="ASSIGNMENTS">
                  <option value="ASSIGNMENTS">ASSIGNMENTS</option>
                  <option value="QUIZZES">QUIZZES</option>
                  <option value="EXAMS">EXAMS</option>
                  <option value="PROJECT">PROJECT</option>
                </select>
              </td>
            </tr>
  
            <tr>
              <td align="right" valign="top">
                <label htmlFor="wd-display-grade-as">Display Grade as</label>
              </td>
              <td>
                <select id="wd-display-grade-as" defaultValue="PERCENTAGE">
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="POINTS">Points</option>
                  <option value="LETTER">Letter Grade</option>
                </select>
              </td>
            </tr>
  
            <tr>
              <td align="right" valign="top">
                <label htmlFor="wd-submission-type">Submission Type</label>
              </td>
              <td>
                <select id="wd-submission-type" defaultValue="ONLINE">
                  <option value="ONLINE">Online</option>
                  <option value="ON_PAPER">On Paper</option>
                  <option value="NO_SUBMISSION">No Submission</option>
                </select>
  
                <br />
                <br />
  
                <div>
                  <label>Online Entry Options</label>
                  <br />
                  <input id="wd-text-entry" type="checkbox" />
                  <label htmlFor="wd-text-entry">Text Entry</label>
                  <br />
  
                  <input id="wd-website-url" type="checkbox" defaultChecked />
                  <label htmlFor="wd-website-url">Website URL</label>
                  <br />
  
                  <input id="wd-media-recordings" type="checkbox" />
                  <label htmlFor="wd-media-recordings">Media Recordings</label>
                  <br />
  
                  <input id="wd-student-annotation" type="checkbox" />
                  <label htmlFor="wd-student-annotation">Student Annotation</label>
                  <br />
  
                  <input id="wd-file-uploads" type="checkbox" />
                  <label htmlFor="wd-file-uploads">File Uploads</label>
                </div>
              </td>
            </tr>
  
            <tr>
              <td align="right" valign="top">
                <label htmlFor="wd-assign-to">Assign to</label>
              </td>
              <td>
                <input id="wd-assign-to" defaultValue="Everyone" />
              </td>
            </tr>
  
            <tr>
              <td align="right" valign="top">
                <label htmlFor="wd-due-date">Due</label>
              </td>
              <td>
                <input id="wd-due-date" type="date" defaultValue="2026-05-13" />
              </td>
            </tr>
  
            <tr>
              <td align="right" valign="top">
                <label htmlFor="wd-available-from">Available from</label>
              </td>
              <td>
                <input
                  id="wd-available-from"
                  type="date"
                  defaultValue="2026-05-06"
                />
              </td>
            </tr>
  
            <tr>
              <td align="right" valign="top">
                <label htmlFor="wd-available-until">Until</label>
              </td>
              <td>
                <input
                  id="wd-available-until"
                  type="date"
                  defaultValue="2026-05-20"
                />
              </td>
            </tr>
          </tbody>
        </table>
  
        <br />
  
        <button id="wd-cancel-assignment">Cancel</button>{" "}
        <button id="wd-save-assignment">Save</button>
      </div>
    );
  }
  