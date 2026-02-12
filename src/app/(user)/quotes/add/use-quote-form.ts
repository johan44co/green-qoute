"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Form as BaseForm } from "@base-ui/react/form";
import { apiClient, ApiError, QuoteResponse } from "@/lib/api-client";

const quoteSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  address1: z.string().min(3, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  region: z.string().optional(),
  zip: z.string().min(3, "ZIP/Postal code is required"),
  country: z.string().min(2, "Country is required"),
  monthlyConsumptionKwh: z.coerce
    .number({ message: "Must be a number" })
    .positive("Monthly consumption must be a positive number"),
  systemSizeKw: z.coerce
    .number({ message: "Must be a number" })
    .positive("System size must be a positive number"),
  downPayment: z.coerce
    .number({ message: "Must be a number" })
    .min(0, "Down payment cannot be negative")
    .optional(),
});

interface QuoteFormProps {
  onSuccess?: (data: QuoteResponse) => void;
}

export function useQuoteForm({ onSuccess }: QuoteFormProps = {}) {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formValues: BaseForm.Values) => {
    setIsLoading(true);
    setErrorMessage(null);
    setErrors({});

    // Convert string inputs to numbers
    const processedValues = {
      ...formValues,
      monthlyConsumptionKwh: Number(formValues.monthlyConsumptionKwh),
      systemSizeKw: Number(formValues.systemSizeKw),
      downPayment: formValues.downPayment
        ? Number(formValues.downPayment)
        : undefined,
    };

    // Validate
    const result = quoteSchema.safeParse(processedValues);

    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const data = await apiClient.createQuote(result.data);
      if (onSuccess) {
        onSuccess(data);
      } else {
        // Navigate to the quote detail page
        router.push(`/quotes/${data.id}`);
      }
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.details) {
        setErrors(apiError.details);
      } else {
        setErrorMessage(
          apiError.error || "An unexpected error occurred. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    errors,
    errorMessage,
    isLoading,
    handleSubmit,
  };
}
