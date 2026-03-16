"use client";
import { usePathname } from "next/navigation";
export default function ClientComponentDemo() {
  const pathname = usePathname();
  return (
    <div>
      <h1>Client Component Demo</h1>
      <p>Current pathname: {pathname}</p>
    </div>
  );
}
