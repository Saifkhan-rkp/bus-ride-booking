import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { getAllLocations } from "@/lib/location";

export const metadata = constructMetadata({
  title: "Dashboard – Next Template",
  description: "Create and manage content.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  // Fetch locations directly within the component using the server-side function
  const locations = await getAllLocations();

  if (!locations || locations.length === 0) {
    return <p className="text-center text-red-500">No locations found.</p>;
  }

  const handleSearch = async () => {
    const origin = (document.getElementById("origin") as HTMLSelectElement).value;
    const destination = (document.getElementById("destination") as HTMLSelectElement).value;

    if (!origin || !destination) {
      alert("Please select both origin and destination");
      return;
    }

    console.log(`Searching for buses from ${origin} to ${destination}`);
    // Add the code to search for buses based on the selected origin and destination

    try {
      const response = await fetch(`/api/fares/search?origin=${origin}&destination=${destination}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch buses.");
      }

      const result = await response.json();

      if (result && result.length > 0) {
        console.log("Available buses:", result);
        // Handle displaying the result (pass it to your component for rendering)
      } else {
        console.log("No buses found for the selected route.");
      }
    } catch (error) {
      console.error("Error searching buses:", error);
    }

  };

  return (
    <>
      <DashboardHeader
        heading="Search for Buses"
      />

      <div className="flex items-center justify-center ">
        <form method="get" className=" flex h-[10vh] w-[60vw] rounded-3xl" onClick={() => handleSearch()} >

          {/* Origin Dropdown */}
          <div className="h-full w-2/5 rounded-3xl">

            <select
              id="origin"
              name="origin"
              // defaultValue={origin || ""}
              className="sm:text-md size-full rounded-l-3xl border-gray-300 px-8 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="" disabled>
                Select Origin
              </option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Destination Dropdown */}
          <div className="h-full w-2/5 rounded-3xl bg-slate-500">

            <select
              id="desination"
              name="destination"
              className="sm:text-md size-full border-gray-300 px-8 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >

              <option value="" disabled>
                Select Destination
              </option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-1/5 rounded-r-3xl bg-zinc-900 px-5 py-2 text-lg text-white hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:ring-offset-2"

          >
            Search
          </button>

        </form>
      </div>

      <EmptyPlaceholder>

      </EmptyPlaceholder>
    </>
  );
}
