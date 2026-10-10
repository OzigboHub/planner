import { NextResponse } from "next/server";
import { getAllTributes, insertTribute } from "../../lib/db";

export async function GET() {
  try {
    const tributes = getAllTributes();
    return NextResponse.json({ success: true, tributes });
  } catch (error: any) {
    console.error("Failed to fetch tributes from database:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve tributes from database" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { author_name, relationship, location, message, candle_lit } = body;

    if (!author_name || typeof author_name !== "string" || !author_name.trim()) {
      return NextResponse.json(
        { success: false, error: "Author name is required" },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "Tribute message is required" },
        { status: 400 }
      );
    }

    const newTribute = insertTribute({
      author_name: author_name.trim(),
      relationship: relationship ? String(relationship).trim() : undefined,
      location: location ? String(location).trim() : undefined,
      message: message.trim(),
      candle_lit: candle_lit !== false,
    });

    return NextResponse.json({ success: true, tribute: newTribute }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to save tribute to database:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save tribute to database" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
      } catch {}
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Tribute ID is required" },
        { status: 400 }
      );
    }

    const { deleteTribute } = await import("../../lib/db");
    const deleted = deleteTribute(id);

    if (deleted) {
      return NextResponse.json({ success: true, message: "Tribute deleted successfully" });
    } else {
      return NextResponse.json(
        { success: false, error: "Tribute not found" },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error("Failed to delete tribute:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete tribute from database" },
      { status: 500 }
    );
  }
}
