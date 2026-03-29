"use client";

import React, { useState } from "react";
import { FormCheck, FormControl } from "react-bootstrap";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export default function WorkingWithArrays() {
  const API = `${HTTP_SERVER}/lab5/todos`;
  const [todo, setTodo] = useState({
    id: "1",
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-09-09",
    completed: false,
  });

  return (
    <div id="wd-working-with-arrays">
      <h2>Working with Arrays</h2>

      <h3>Retrieving Arrays</h3>
      <a id="wd-retrieve-todos" className="btn btn-primary" href={API}>
        Get Todos
      </a>

      <h3>Filtering Array Items</h3>
      <a
        id="wd-retrieve-completed-todos"
        className="btn btn-primary"
        href={`${API}?completed=true`}
      >
        Get Completed Todos
      </a>
      <hr />

      <h3>Retrieving an Item from an Array by ID</h3>
      <div className="clearfix mb-2">
        <a
          id="wd-retrieve-todo-by-id"
          className="btn btn-primary float-end"
          href={`${API}/${todo.id}`}
        >
          Get Todo by ID
        </a>
        <FormControl
          id="wd-todo-id"
          className="w-50"
          defaultValue={todo.id}
          onChange={(e) => setTodo({ ...todo, id: e.target.value })}
        />
      </div>
      <hr />

      <h3>Creating new Items in an Array</h3>
      <a id="wd-create-todo" className="btn btn-primary" href={`${API}/create`}>
        Create Todo
      </a>
      <hr />

      <h3>Removing from an Array</h3>
      <div className="clearfix mb-2">
        <a
          id="wd-remove-todo"
          className="btn btn-primary float-end"
          href={`${API}/${todo.id}/delete`}
        >
          Remove Todo with ID = {todo.id}
        </a>
        <FormControl
          className="w-50"
          defaultValue={todo.id}
          onChange={(e) => setTodo({ ...todo, id: e.target.value })}
        />
      </div>
      <hr />

      <h3>Updating an Item in an Array</h3>
      <a
        className="btn btn-primary float-end"
        href={`${API}/${todo.id}/title/${encodeURIComponent(todo.title)}`}
      >
        Update Todo
      </a>
      <FormControl
        className="w-25 float-start me-2"
        defaultValue={todo.id}
        onChange={(e) => setTodo({ ...todo, id: e.target.value })}
      />
      <FormControl
        className="w-50 float-start"
        defaultValue={todo.title}
        onChange={(e) => setTodo({ ...todo, title: e.target.value })}
      />
      <br />
      <br />
      <hr />

      <h3>Updating Completed and Description</h3>
      <div className="clearfix mb-2">
        <a
          id="wd-update-todo-completed"
          className="btn btn-primary float-end"
          href={`${API}/${todo.id}/completed/${todo.completed}`}
        >
          Complete Todo ID = {todo.id}
        </a>
        <FormCheck
          id="wd-todo-completed"
          type="checkbox"
          label="Completed"
          checked={todo.completed}
          onChange={(e) =>
            setTodo({ ...todo, completed: e.target.checked })
          }
        />
      </div>
      <div className="clearfix mb-2">
        <a
          id="wd-update-todo-description"
          className="btn btn-primary float-end"
          href={`${API}/${todo.id}/description/${encodeURIComponent(todo.description)}`}
        >
          Describe Todo ID = {todo.id}
        </a>
        <FormControl
          id="wd-todo-description"
          className="w-50"
          as="textarea"
          rows={2}
          value={todo.description}
          onChange={(e) =>
            setTodo({ ...todo, description: e.target.value })
          }
        />
      </div>
      <hr />
    </div>
  );
}
