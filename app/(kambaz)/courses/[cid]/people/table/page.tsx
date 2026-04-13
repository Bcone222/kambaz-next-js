"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import PeopleTable from "../Table";
import * as client from "../../../../account/client";
import { enrollments } from "../../../../database";

export default function CoursePeopleTablePage() {
  const { cid } = useParams();
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = useCallback(async () => {
    const all = await client.findAllUsers();
    const filtered = all.filter((u: any) =>
      enrollments.some(
        (e: any) => e.user === u._id && e.course === cid
      )
    );
    setUsers(filtered);
  }, [cid]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  return <PeopleTable users={users} fetchUsers={fetchUsers} />;
}
