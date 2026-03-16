import { Suspense } from "react";
import QueryCalculator from "./QueryCalculator";

export default function QueryParamsPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <QueryCalculator />
    </Suspense>
  );
}
