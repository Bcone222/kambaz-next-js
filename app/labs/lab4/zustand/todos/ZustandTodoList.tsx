"use client";
import { useTodoStore } from "./useTodoStore";
import { ListGroup, ListGroupItem, Button, FormControl } from "react-bootstrap";

export default function ZustandTodoList() {
  const { todos, todo, setTodo, addTodo, updateTodo, deleteTodo } = useTodoStore(
    (state) => state,
  );
  return (
    <div id="wd-zustand-todo-list">
      <h2>Todo List</h2>
      <ListGroup>
        <ListGroupItem className="d-flex align-items-center">
          <FormControl
            value={todo.title}
            onChange={(e) => setTodo({ ...todo, title: e.target.value })}
          />
          <Button onClick={updateTodo} className="btn btn-warning ms-2">
            Update
          </Button>
          <Button onClick={addTodo} className="btn btn-success ms-2">
            Add
          </Button>
        </ListGroupItem>
        {todos.map((t) => (
          <ListGroupItem key={t.id} className="d-flex justify-content-between align-items-center">
            <span>{t.title}</span>
            <div>
              <Button onClick={() => setTodo(t)} className="btn btn-primary me-2">
                Edit
              </Button>
              <Button onClick={() => deleteTodo(t.id)} className="btn btn-danger">
                Delete
              </Button>
            </div>
          </ListGroupItem>
        ))}
      </ListGroup>
      <hr />
    </div>
  );
}
