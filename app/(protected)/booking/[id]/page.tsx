// import { DashboardHeader } from "@/components/dashboard/header"

// const BookingPage = () => {

//     return (
//         <>
//             <DashboardHeader
//                 heading="Ticket Booking"
//             />
//         </>
//     )
// }

// export default BookingPage


import BookingConfirm from "@/components/booking/booking-confirm";
import { DashboardHeader } from "@/components/dashboard/header";
import { getFareById } from "@/lib/fare";
import { getCurrentUser } from "@/lib/session";
import React from "react";

interface BookingPageProps {
    params: { id: string }; // Access the dynamic route parameter
}

const BookingConfirmation: React.FC<BookingPageProps> = async ({ params }) => {

    const user = await getCurrentUser();

    const { id } = params;

    const bus = await getFareById(id)

    return (
        <>
            <DashboardHeader
                heading="Booking Confirmation"
            />

            <BookingConfirm
                id={bus?.id as string}
                userid={user?.id as string}
                fare={bus?.price as number}
            />
        </>

    );
};

export default BookingConfirmation;
