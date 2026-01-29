export default function Inbox() {
  return (
    <div id="wd-inbox-screen">
      <h1>Inbox</h1>
      <div id="wd-inbox-filters">
        <button>All</button>
        <button>Unread</button>
        <button>Starred</button>
        <button>Sent</button>
      </div>
      <div id="wd-inbox-messages">
        <table>
          <thead>
            <tr>
              <th>From</th>
              <th>Subject</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Jose Annunziato</td>
              <td>Welcome to CS4550</td>
              <td>Jan 3, 2026</td>
            </tr>
            <tr>
              <td>Alice Wonderland</td>
              <td>Assignment 1 Due Date</td>
              <td>Feb 1, 2026</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
