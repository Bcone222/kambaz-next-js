"use client";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountPage() {
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/account/signin");
    } else {
      router.push("/account/profile");
    }
  }, [currentUser, router]);

  return null;
}
