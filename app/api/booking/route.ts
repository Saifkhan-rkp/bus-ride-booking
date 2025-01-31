import { addBooking, getAllBookings } from "@/lib/booking";
import { prisma } from "@/lib/db";
import { getFareById } from "@/lib/fare";
import { getRouteById } from "@/lib/route";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        // Parse the request body
        const { userId, fareId, seatNo, date } = await req.json();

        // Validate required inputs
        if (!userId || !fareId) {
            return NextResponse.json({ success: false, message: "Missing required fields." }, { status: 400 });
        }

        const bus = await getFareById(fareId)


        if (!bus) {
            return NextResponse.json({ success: false, message: "Invalid fare ID." }, { status: 404 });
        }

        const routeId = bus.routeId;

        // Check if the seat is already booked for the given route, date, and seat number
        const existingBooking = await prisma.booking.findFirst({
            where: {
                routeId: routeId,
                date: new Date(date).toISOString(),
                seatNumber: seatNo,
            },
        });

        if (existingBooking) {
            return NextResponse.json(
                { success: false, message: `Seat number ${seatNo} is already booked for this route and date.` },
                { status: 409 }
            );
        }


        const bookingData = {
            routeId: bus?.routeId as string,
            userId: userId,
            fromLocationId: bus?.origin.id as string,
            toLocationId: bus?.destination.id as string,
            date: new Date(date).toISOString(),
            seatNumber: seatNo,
            bookingStatus: "pending",
            fareId: fareId,
        }

        const result = await addBooking(bookingData);

        // Check if the booking was successful
        if (result?.error)
            return NextResponse.json(result, { status: 400 });
        return NextResponse.json(result, { status: 201 });
        // return NextResponse.json({ success: true, booking: result }, { status: 200 });
    } catch (error: any) {
        console.error("Error creating booking:", error.message);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

