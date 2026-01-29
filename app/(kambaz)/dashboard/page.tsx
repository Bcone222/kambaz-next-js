import Link from "next/link";
import Image from "next/image";

export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
      <div id="wd-dashboard-courses">
      <div className="wd-dashboard-course">
          <Link href="/courses/1234" className="wd-dashboard-course-link">
            <Image src="/images/dashboardpic.jpg" width={200} height={150} alt="reactjs" />
            <div>
              <h5>CS1234 React JS</h5>
              <p className="wd-dashboard-course-title">Full Stack software developer</p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/3500" className="wd-dashboard-course-link">
            <Image src="/images/dashboardpic.jpg" width={200} height={150} alt="oop" />
            <div>
              <h5>CS3500 Object Oriented Programming</h5>
              <p className="wd-dashboard-course-title">Object Oriented Programming</p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/3650" className="wd-dashboard-course-link">
            <Image src="/images/dashboardpic.jpg" width={200} height={150} alt="systems" />
            <div>
              <h5>CS3650 Computer Systems</h5>
              <p className="wd-dashboard-course-title">Computer Systems</p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/3800" className="wd-dashboard-course-link">
            <Image src="/images/dashboardpic.jpg" width={200} height={150} alt="theory" />
            <div>
              <h5>CS3800 Theory of Computation</h5>
              <p className="wd-dashboard-course-title">Theory of Computation</p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/4530" className="wd-dashboard-course-link">
            <Image src="/images/dashboardpic.jpg" width={200} height={150} alt="software" />
            <div>
              <h5>CS4530 Fundamentals of Software Engineering</h5>
              <p className="wd-dashboard-course-title">Fundamentals of Software Engineering</p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/3000" className="wd-dashboard-course-link">
            <Image src="/images/dashboardpic.jpg" width={200} height={150} alt="datascience" />
            <div>
              <h5>DS3000 Foundations of Data Science</h5>
              <p className="wd-dashboard-course-title">Foundations of Data Science</p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/4300" className="wd-dashboard-course-link">
            <Image src="/images/dashboardpic.jpg" width={200} height={150} alt="hci" />
            <div>
              <h5>IS4300 Human Computer Interaction</h5>
              <p className="wd-dashboard-course-title">Human Computer Interaction</p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/4550" className="wd-dashboard-course-link">
            <Image src="/images/dashboardpic.jpg" width={200} height={150} alt="webdev" />
            <div>
              <h5>CS4550 Web Development</h5>
              <p className="wd-dashboard-course-title">Web Development</p>
              <button>Go</button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
