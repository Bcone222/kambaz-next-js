import { FaEllipsisV } from "react-icons/fa";
import { BsPlus } from "react-icons/bs";
import GreenCheckmark from "./GreenCheckmark";

export default function ModuleControlButtons() {
  return (
    <span className="float-end">
      <GreenCheckmark />
      <BsPlus className="me-2" />
      <FaEllipsisV className="me-2" />
    </span>
  );
}
