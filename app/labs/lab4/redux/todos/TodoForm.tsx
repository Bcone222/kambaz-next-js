import { useSelector, useDispatch } from "react-redux";
import { addTodo, updateTodo, setTodo } from "./todosReducer";
import { RootState } from "../../store";
import { ListGroupItem, Button, FormControl } from "react-bootstrap";

export default function TodoForm() {
  const { todo } = useSelector((state: RootState) => state.todosReducer);
  const dispatch = useDispatch();
  return (
    <ListGroupItem className="d-flex align-items-center">
      <FormControl
        defaultValue={todo.title}
        onChange={(e) => dispatch(setTodo({ ...todo, title: e.target.value }))} />
      <Button onClick={() => dispatch(updateTodo(todo))} className="btn btn-warning ms-2"
        id="wd-update-todo-click"> Update </Button>
      <Button onClick={() => dispatch(addTodo(todo))} className="btn btn-success ms-2"
        id="wd-add-todo-click"> Add </Button>
    </ListGroupItem>
  );
}
