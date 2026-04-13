"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import PeopleTable from "../Table";
import * as coursesClient from "../../../client";

export default function CoursePeopleTablePage() {
  const { cid } = useParams();
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = useCallback(async () => {
    if (!cid) return;
    const list = await coursesClient.findUsersForCourse(cid as string);
    setUsers(list);
  }, [cid]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  return <PeopleTable users={users} fetchUsers={fetchUsers} />;
}
