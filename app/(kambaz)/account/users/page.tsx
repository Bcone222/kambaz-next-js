"use client";
import { useState, useEffect, useCallback } from "react";
import { FormControl } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import PeopleTable from "../../courses/[cid]/people/Table";
import * as client from "../client";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [role, setRole] = useState("");

  const fetchUsers = useCallback(async () => {
    const list = await client.findAllUsers();
    setUsers(list);
  }, []);

  const filterUsersByRole = async (r: string) => {
    setRole(r);
    if (r) {
      const list = await client.findUsersByRole(r);
      setUsers(list);
    } else {
      await fetchUsers();
    }
  };

  const filterUsersByName = async (n: string) => {
    if (n) {
      const list = await client.findUsersByPartialName(n);
      setUsers(list);
    } else {
      await fetchUsers();
    }
  };

  const createUser = async () => {
    const user = await client.createUser({
      firstName: "New",
      lastName: `User${users.length + 1}`,
      username: `newuser${Date.now()}`,
      password: "password123",
      email: `email${users.length + 1}@neu.edu`,
      section: "S101",
      role: "STUDENT",
    });
    setUsers([...users, user]);
  };

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  return (
    <div>
      <h3>Users</h3>
      <button
        type="button"
        onClick={() => void createUser()}
        className="float-end btn btn-danger wd-add-people"
      >
        <FaPlus className="me-2" />
        Users
      </button>
      <FormControl
        onChange={(e) => void filterUsersByName(e.target.value)}
        placeholder="Search people"
        className="float-start w-25 me-2 wd-filter-by-name"
      />
      <select
        value={role}
        onChange={(e) => void filterUsersByRole(e.target.value)}
        className="form-select float-start w-25 wd-select-role"
      >
        <option value="">All Roles</option>
        <option value="STUDENT">Students</option>
        <option value="TA">Assistants</option>
        <option value="FACULTY">Faculty</option>
        <option value="ADMIN">Administrators</option>
      </select>
      <PeopleTable users={users} fetchUsers={fetchUsers} />
    </div>
  );
}
