export default function Calendar() {
  return (
    <div id="wd-calendar-screen">
      <h1>Calendar</h1>
      <div id="wd-calendar-view">
        <h2>View</h2>
        <button>Month</button>
        <button>Week</button>
        <button>Day</button>
        <button>Agenda</button>
      </div>
      <div id="wd-calendar-events">
        <h2>Coming Up</h2>
        <ul>
          <li>
            <a href="#">DS3000 Foundations of Data Science - Lecture</a>
            <p>Feb 7 at 11:45am</p>
          </li>
          <li>
            <a href="#">CS4530 Fundamentals of Software Engineering - Assignment</a>
            <p>Feb 11 at 11:59pm</p>
          </li>
        </ul>
      </div>
    </div>
  );
}
