// /pages/api/fares/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getAllFares, getFaresByFilter } from "@/lib/fare";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest, res: Response) {
    return NextResponse.json({ error: "Temporarily Disabled" });

    try {
        const { searchParams } = req?.nextUrl; // Access the URL's query parameters
        const origin = searchParams?.get("origin");
        const destination = searchParams?.get("destination");


        const allFares = await getFaresByFilter({
            origin: Array.isArray(origin) ? origin[0] : origin || '',
            destination: Array.isArray(destination) ? destination[0] : destination || ''
        });

        // // Filter fares by origin and destination if provided
        return NextResponse.json(allFares);
        // if (origin && destination) {
        //     const filteredFares = allFares.filter(
        //         (fare) =>
        //             fare.origin.id === origin && fare.destination.id === destination
        //     );

        //     if (filteredFares.length === 0) {
        //         return NextResponse.json({ error: "No Bus found for the selected route" });
        //     }

            

        //     return NextResponse.json(filteredFares);
        // }

        // Return all fares if no filters are applied
    } catch (error) {
        console.error("Error fetching fares:", error);
        return NextResponse.json({ error: "Internal server error" });
    }
}