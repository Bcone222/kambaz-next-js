import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const a = parseFloat(searchParams.get("a") ?? "");
  const b = parseFloat(searchParams.get("b") ?? "");
  const operation = searchParams.get("operation");

  if (Number.isNaN(a) || Number.isNaN(b)) {
    return NextResponse.json({ error: "Invalid numbers" }, { status: 400 });
  }

  let result: number;
  switch (operation) {
    case "add":
      result = a + b;
      break;
    case "subtract":
      result = a - b;
      break;
    case "multiply":
      result = a * b;
      break;
    case "divide":
      if (b === 0) {
        return NextResponse.json({ error: "Division by zero" }, { status: 400 });
      }
      result = a / b;
      break;
    default:
      return NextResponse.json({ error: "Invalid operation" }, { status: 400 });
  }

  return NextResponse.json({ a, b, operation, result });
}
