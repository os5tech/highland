import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "highland-virtual-time-pm",
    timestamp: new Date().toISOString(),
  });
}
