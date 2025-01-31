
import { getFaresByFilter } from "@/lib/fare";
import { isDynamicServerError } from "next/dist/client/components/hooks-server-context";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    try {
        const {searchParams} = new URL(req.nextUrl); // Create a URL object
        const origin = searchParams.get("origin");
        const destination = searchParams.get("destination");


        const allFares = await getFaresByFilter({
            origin: origin || "",
            destination: destination || "",
        });

        return NextResponse.json(allFares);

    } catch (error) {
        if (isDynamicServerError(error)) {
            throw error;
        }
        console.error("Error fetching fares:", error);
        return NextResponse.json({ error: "Internal server error" });
    }
}   