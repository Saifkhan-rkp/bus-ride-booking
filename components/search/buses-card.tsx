import React from "react";
import { MoveRight } from "lucide-react";
import Link from "next/link";

interface AvailableBusCardProps {
    id: string
    busName?: string|undefined;
    startLocation?: string|undefined;
    startTime?: string|undefined;
    endLocation?: string|undefined;
    endTime?: string|undefined;
    vehicleNumber?: string|undefined;
    userStartLocation?: string|undefined;
    userEndLocation?: string|undefined;
    fare?: number|undefined;
    type?: string|undefined;
    availableSeats?: number|undefined;
}

const AvailableBusCard: React.FC<AvailableBusCardProps> = ({
    id,
    busName,
    startLocation,
    startTime,
    endLocation,
    endTime,
    vehicleNumber,
    userStartLocation,
    userEndLocation,
    fare,
    type,
    availableSeats,
}) => {
    return (
        
        <Link href={`/booking/${id}`} className="flex flex-col px-10 py-4 border rounded-lg shadow-md bg-white w-[500px] mx-auto">
            <div className="flex justify-between items-center gap-20 border-b pb-2 mb-2">
                <h2 className="text-xl font-bold text-gray-800">{busName}</h2>
                <p className="text-sm text-gray-500">{vehicleNumber}</p>
            </div>

            <div className="mb-4">

                <div className="flex justify-between text-sm text-gray-600">
                    <div>
                        <p className="font-semibold text-gray-800">Start Location</p>
                        <p className="font-semibold">{startLocation}</p>
                        <p className="text-xs text-gray-700">{new Date(startTime as string).toLocaleTimeString()}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">End Location</p>
                        <p className="font-semibold">{endLocation}</p>
                        <p className="text-xs text-gray-700">{new Date(endTime as string).toLocaleTimeString()}</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-center items-center border-b pb-4 mb-4">
                <div className="text-sm">
                    <p className="font-semibold text-gray-800">Type</p>
                    <p>{type}</p>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <div className="text-sm">
                    <p className="font-semibold text-gray-800">Start</p>
                    <p>{userStartLocation}</p>
                </div>
                <MoveRight />
                <div className="text-sm">
                    <p className="font-semibold text-gray-800">End</p>
                    <p>{userEndLocation}</p>
                </div>
                <div className="text-sm">
                    <p className="font-semibold text-gray-800">Fare</p>
                    <p className="font-bold text-green-600">₹{fare}</p>
                </div>
                <div className="text-sm">
                    <p className="font-semibold text-gray-800">Available Seats</p>
                    <p>20</p>
                </div>
            </div>
        </Link>
    );
};

export default AvailableBusCard;