import { BirthTimeInput } from "@internal/types/kundali-types";

// Utility functions for astronomical calculations
export function validateBirthTimeInput(input: unknown): input is BirthTimeInput {
  if (!input || typeof input !== "object") return false;
  
  const data = input as Record<string, unknown>;
  
  return (
    typeof data.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(data.date) &&
    typeof data.time === "string" &&
    /^\d{2}:\d{2}(:\d{2})?$/.test(data.time) &&
    typeof data.latitude === "number" &&
    data.latitude >= -90 &&
    data.latitude <= 90 &&
    typeof data.longitude === "number" &&
    data.longitude >= -180 &&
    data.longitude <= 180 &&
    typeof data.timezone === "string" &&
    data.timezone.length > 0
  );
}