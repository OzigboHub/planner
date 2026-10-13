import { NextResponse } from "next/server";
import { getPlannerData, updatePlannerData } from "../../lib/plannerDb";

export async function GET() {
  try {
    const data = getPlannerData();
    return NextResponse.json(
      { success: true, data },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("Failed to fetch planner data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve planner data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, data } = body;

    if (!key || typeof key !== "string") {
      return NextResponse.json(
        { success: false, error: "Key is required" },
        { status: 400 }
      );
    }

    const updated = updatePlannerData(key, data);
    return NextResponse.json(
      { success: true, data: updated },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("Failed to update planner data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save planner data" },
      { status: 500 }
    );
  }
}
