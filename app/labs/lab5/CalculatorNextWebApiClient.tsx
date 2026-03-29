"use client";

import { useState } from "react";
import { Alert } from "react-bootstrap";

const OPERATIONS = [
  { label: "+", value: "add" },
  { label: "-", value: "subtract" },
  { label: "×", value: "multiply" },
  { label: "÷", value: "divide" },
];

export default function CalculatorNextWebApiClient() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [operation, setOperation] = useState("add");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const calculate = async (op?: string) => {
    const nextOp = op ?? operation;
    setOperation(nextOp);
    setResult(null);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(
        `/api/lab5/calculator?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}&operation=${nextOp}`
      );
      const data = (await res.json()) as { error?: string; result?: number };
      if (!res.ok) {
        setError(data.error ?? "Unknown error");
      } else if (typeof data.result === "number") {
        setResult(data.result);
      }
    } catch {
      setError("Failed to reach the server");
    } finally {
      setLoading(false);
    }
  };

  const operationSymbol =
    OPERATIONS.find((op) => op.value === operation)?.label ?? "";

  return (
    <div className="p-4">
      <h2>Calculator (Next.js Web API)</h2>
      <label htmlFor="a-input" className="w-25">
        A:
      </label>
      <input
        type="number"
        value={a}
        placeholder="A"
        id="a-input"
        className="form-control w-25 d-inline"
        onChange={(e) => setA(e.target.value)}
      />
      <br />
      <label htmlFor="b-input" className="w-25">
        B:
      </label>
      <input
        type="number"
        value={b}
        placeholder="B"
        id="b-input"
        className="form-control w-25 d-inline"
        onChange={(e) => setB(e.target.value)}
      />
      <br />
      <label htmlFor="operation-select" className="w-25">
        Operation:
      </label>
      <select
        id="operation-select"
        value={operation}
        className="form-select w-25 d-inline"
        onChange={(e) => {
          calculate(e.target.value);
        }}
      >
        {OPERATIONS.map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>
      <br />
      <button
        className="btn btn-primary mt-3 w-50"
        disabled={loading || a === "" || b === ""}
        onClick={() => calculate(operation)}
      >
        {loading ? "Calculating..." : "Calculate"}
      </button>
      <br />
      <label className="w-25">Result:</label>
      {result !== null && (
        <input
          readOnly
          value={`${a} ${operationSymbol} ${b} = ${result}`}
          className="form-control w-25 d-inline"
        />
      )}
      {error && (
        <Alert variant="danger" className="mt-3 mb-0">
          {error}
        </Alert>
      )}
    </div>
  );
}
