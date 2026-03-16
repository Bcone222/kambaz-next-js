import { useDispatch } from "react-redux";
import { deleteTodo, setTodo } from "./todosReducer";
import { ListGroupItem, Button } from "react-bootstrap";

export default function TodoItem({ todo }: {
  todo: { id: string; title: string };
}) {
  const dispatch = useDispatch();
  return (
    <ListGroupItem key={todo.id} className="d-flex justify-content-between align-items-center">
      <span>{todo.title}</span>
      <div>
        <Button onClick={() => dispatch(setTodo(todo))} className="btn btn-primary me-2"
          id="wd-set-todo-click"> Edit </Button>
        <Button onClick={() => dispatch(deleteTodo(todo.id))} className="btn btn-danger"
          id="wd-delete-todo-click"> Delete </Button>
      </div>
    </ListGroupItem>
  );
}
