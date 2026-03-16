"use client";
import { useCounterStore } from "./useCounterStore";

export default function ZustandCounter() {
  const { count, increase, decrease, setCount, reset } = useCounterStore(
    (state) => state,
  );
  return (
    <div className="m-2">
      <h2>Zustand Counter</h2>
      Count: {count}
      <br />
      <button onClick={() => increase(1)} className="btn btn-primary me-2">Increase</button>
      <button onClick={() => decrease(1)} className="btn btn-primary me-2">Decrease</button>
      <button onClick={() => setCount(10)} className="btn btn-warning me-2">Set to 10</button>
      <button onClick={() => reset()} className="btn btn-danger">Reset</button>
      <hr />
    </div>
  );
}
