import { FaEllipsisV } from "react-icons/fa";
import GreenCheckmark from "./GreenCheckmark";

export default function LessonControlButtons() {
  return (
    <span className="float-end">
      <GreenCheckmark />
      <FaEllipsisV className="me-2" />
    </span>
  );
}
