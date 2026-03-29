"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import { RootState } from "../../store";
import { FormControl } from "react-bootstrap";
import * as client from "../client";

export default function Profile() {
  const [profile, setProfile] = useState<Record<string, string>>({});
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );

  const updateProfile = async () => {
    const updatedProfile = await client.updateUser({
      ...profile,
      _id: currentUser!._id,
    });
    dispatch(setCurrentUser(updatedProfile));
  };

  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    router.push("/account/signin");
  };

  useEffect(() => {
    if (!currentUser) {
      router.push("/account/signin");
      return;
    }
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) {
        setProfile({ ...currentUser } as Record<string, string>);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [currentUser, router]);

  return (
    <div id="wd-profile-screen">
      <h3>Profile</h3>
      {profile && Object.keys(profile).length > 0 && (
        <div>
          <FormControl
            id="wd-username"
            className="mb-2"
            value={profile.username ?? ""}
            onChange={(e) =>
              setProfile({ ...profile, username: e.target.value })
            }
          />
          <FormControl
            id="wd-password"
            className="mb-2"
            value={profile.password ?? ""}
            type="password"
            onChange={(e) =>
              setProfile({ ...profile, password: e.target.value })
            }
          />
          <FormControl
            id="wd-firstname"
            className="mb-2"
            value={profile.firstName ?? ""}
            onChange={(e) =>
              setProfile({ ...profile, firstName: e.target.value })
            }
          />
          <FormControl
            id="wd-lastname"
            className="mb-2"
            value={profile.lastName ?? ""}
            onChange={(e) =>
              setProfile({ ...profile, lastName: e.target.value })
            }
          />
          <FormControl
            id="wd-dob"
            className="mb-2"
            type="date"
            value={(profile.dob ?? "").slice(0, 10)}
            onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
          />
          <FormControl
            id="wd-email"
            className="mb-2"
            value={profile.email ?? ""}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
          <select
            className="form-control mb-2"
            id="wd-role"
            value={profile.role || "USER"}
            onChange={(e) => setProfile({ ...profile, role: e.target.value })}
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="FACULTY">Faculty</option>
            <option value="STUDENT">Student</option>
          </select>
          <button
            type="button"
            onClick={updateProfile}
            className="btn btn-primary w-100 mb-2"
          >
            Update
          </button>
          <button
            type="button"
            onClick={signout}
            className="wd-signout-btn btn btn-danger w-100"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
