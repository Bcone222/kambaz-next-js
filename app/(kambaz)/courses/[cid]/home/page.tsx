import Modules from "../modules/page";
import CourseStatus from "./Status";

export default function Home() {
  return (
    <div id="wd-home" className="d-flex">
      <div className="flex-fill me-3">
        <Modules />
      </div>
      <div className="d-none d-lg-block">
        <CourseStatus />
      </div>
    </div>
  );
}
