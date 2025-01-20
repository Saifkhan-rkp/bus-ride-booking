import { NextResponse } from "next/server";
import { getAllFares } from "@/lib/fare";  // Ensure this function is correctly fetching fares with pagination support

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10); 
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  try {
    const { fares, total } = await getAllFares({ page, limit });  // Ensure getAllFares supports pagination

    return NextResponse.json({ data: fares, total }, { status: 200 });  // Return the expected format
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch fares" }, { status: 500 });
  }
}
