import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function DataTableDemo() {
  const [data, setData] = useState<Fare[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [managerName, setManagerName] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const router = useRouter();

  const totalPages = Math.ceil(total / pageSize);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/fare/List-fare?page=${pageIndex}&limit=${pageSize}`
        );
        if (!response.ok) throw new Error("Failed to fetch fares");
  
        const { data, total } = await response.json();  // Destructure here
  
        // Assuming the response has an array of fares and a total count
        const formattedData = data.map((fare: any) => ({
          id: fare.id,
          routeId: fare.routeId,
          fromLocation: fare.origin?.name || fare.fromLocationId,
          toLocation: fare.destination?.name || fare.toLocationId,
          price: fare.price,
        }));
  
        setData(formattedData);
        setTotal(total);  // Ensure you are setting the total count
      } catch (error) {
        setError("Failed to fetch fares");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [pageIndex, pageSize]);


  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        const response = await fetch(`/api/fare/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setData((prevData) => prevData.filter(fare => fare.id !== id)); 
        } else {
          setError('Failed to delete fare');
        }
      } catch (error) {
        setError('An error occurred while deleting');
      }
    }
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setManagerName("");
    setManagerEmail("");
    setError("");
    setEditMode(false);
    setViewMode(false);
  };

 
  type Fare = {
    id: string;
    routeId: string;
    fromLocationId: string;
    toLocationId: string;
    fromLocation?: string; 
    toLocation?: string;   
    price: number;
  };

  const columns: ColumnDef<Fare>[] = [
    {
      accessorKey: "routeId",
      header: "Route ID",
    },
    {
      accessorKey: "fromLocation",
      header: "From Location",
    },
    {
      accessorKey: "toLocation",
      header: "To Location",
    },
    {
      accessorKey: "price",
      header: "Price",
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex items-center justify-between py-4">
        <Button className="max-w-sm" onClick={() => router.push("/fare/addForm")}>
          Add Fare
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {data.length ? (
              data.map((fare) => (
                <TableRow key={fare.id}>
                  <TableCell>{fare.routeId}</TableCell>
                  <TableCell>{fare.fromLocation}</TableCell>
                  <TableCell>{fare.toLocation}</TableCell>
                  <TableCell>{fare.price}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="link"
                        onClick={() => {
                          setManagerName(fare.fromLocation || "");
                          setManagerEmail(fare.toLocation || "");
                          setViewMode(true);
                          setIsOpen(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </Button>
                      <Button
                        variant="link"
                        onClick={() => router.push(`/fare/edit/${fare.id}`)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                      <Button variant="link" onClick={() => handleDelete(fare.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm">
          Showing {Math.min((pageIndex - 1) * pageSize + 1, total)}–{Math.min(pageIndex * pageSize, total)} of {total} results
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((prev) => Math.max(prev - 1, 1))}
            disabled={pageIndex === 1}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1;
            return (
              <Button
                key={page}
                variant={pageIndex === page ? "default" : "outline"}
                size="sm"
                onClick={() => setPageIndex(page)}
              >
                {page}
              </Button>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((prev) => Math.min(prev + 1, totalPages))}
            disabled={pageIndex === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
      {isOpen && (
        <div className="bg-/50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="w-96 rounded-md bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold">
              {viewMode ? "View Fare" : editMode ? "Edit Fare" : ""}
            </h3>
            {viewMode && (
              <>
                <p>
                  <strong>From Location:</strong> {managerName}
                </p>
                <p>
                  <strong>To Location:</strong> {managerEmail}
                </p>
              </>
            )}
            <div className="mt-6 text-right">
              <button
                className="rounded-md bg-gray-500 px-4 py-2 text-white"
                onClick={handleCloseDialog}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
