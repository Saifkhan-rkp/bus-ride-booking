"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller, FormProvider } from "react-hook-form"
import { useSession } from "next-auth/react"
import { addLocation } from "@/lib/location" // Make sure the import is correct
type LocationResponse = 
  | { id: string; name: string } // success response with location data
  | { error: string; details: any }; // error response
type FareFormValues = {
  name: string;
};

export default function AddLocationPage() {
  const router = useRouter()

  const methods = useForm<FareFormValues>({
    defaultValues: {
      name: '',
    },
  })

  const { control, handleSubmit, formState: { errors } } = methods

  const onSubmit = async (data: FareFormValues) => {
    try {
      const result = await addLocation(data)
      if (result.error) {
        console.error(result.error)
        return
      }
      router.push("/location") // Redirect to locations page after adding
    } catch (error) {
      console.error("Error saving location:", error)
    }
  }

  return (
    <FormProvider {...methods}>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Add Location</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Input */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Location Name is required" }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"  // Corrected to 'text' for the HTML input type
                  id="name"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              )}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.push("/location")}
              className="px-4 py-2 bg-gray-300 text-black rounded-md"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </FormProvider>
  )
}
