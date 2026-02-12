"use client";
import { Button, Form, Field, Input } from "@/components/ui";
import { useQuoteForm } from "./use-quote-form";

interface QuoteFormProps {
  defaultValues: {
    fullName: string;
    email: string;
  };
}

export function QuoteForm({ defaultValues }: QuoteFormProps) {
  const { errors, errorMessage, isLoading, handleSubmit } = useQuoteForm();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Get Your Solar Quote</h2>
        <p className="text-foreground/70">
          Fill in your details to receive a personalized solar financing quote.
        </p>
      </div>

      <Form errors={errors} onFormSubmit={handleSubmit}>
        {errorMessage && (
          <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {errorMessage}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Field.Root name="fullName">
            <Field.Label>Full Name</Field.Label>
            <Input
              type="text"
              placeholder="John Doe"
              defaultValue={defaultValues.fullName}
            />
            <Field.Error />
          </Field.Root>

          <Field.Root name="email">
            <Field.Label>Email</Field.Label>
            <Input
              type="email"
              placeholder="john@example.com"
              defaultValue={defaultValues.email}
            />
            <Field.Error />
          </Field.Root>
        </div>

        <Field.Root name="address1">
          <Field.Label>Address Line 1</Field.Label>
          <Input
            type="text"
            placeholder="Hauptstraße 123"
          />
          <Field.Error />
        </Field.Root>

        <Field.Root name="address2">
          <Field.Label>Address Line 2 (Optional)</Field.Label>
          <Input
            type="text"
            placeholder="Wohnung 4B"
          />
          <Field.Error />
        </Field.Root>

        <div className="grid gap-6 md:grid-cols-3">
          <Field.Root name="city">
            <Field.Label>City</Field.Label>
            <Input
              type="text"
              placeholder="Berlin"
            />
            <Field.Error />
          </Field.Root>

          <Field.Root name="region">
            <Field.Label>State/Region (Optional)</Field.Label>
            <Input
              type="text"
              placeholder="Berlin"
            />
            <Field.Error />
          </Field.Root>

          <Field.Root name="zip">
            <Field.Label>ZIP/Postal Code</Field.Label>
            <Input
              type="text"
              placeholder="10115"
            />
            <Field.Error />
          </Field.Root>
        </div>

        <Field.Root name="country">
          <Field.Label>Country</Field.Label>
          <Input
            type="text"
            placeholder="Germany"
            defaultValue="Germany"
          />
          <Field.Error />
        </Field.Root>

        <div className="grid gap-6 md:grid-cols-2">
          <Field.Root name="monthlyConsumptionKwh">
            <Field.Label>Monthly Consumption (kWh)</Field.Label>
            <Input
              type="number"
              placeholder="400"
              step="1"
              min="0"
            />
            <Field.Description>
              Average monthly electricity usage
            </Field.Description>
            <Field.Error />
          </Field.Root>

          <Field.Root name="systemSizeKw">
            <Field.Label>System Size (kW)</Field.Label>
            <Input
              type="number"
              placeholder="5"
              step="0.1"
              min="0"
            />
            <Field.Description>
              Desired solar system capacity
            </Field.Description>
            <Field.Error />
          </Field.Root>
        </div>

        <Field.Root name="downPayment">
          <Field.Label>Down Payment (Optional)</Field.Label>
          <Input
            type="number"
            placeholder="0"
            step="100"
            min="0"
          />
          <Field.Description>
            Initial payment amount (leave empty for no down payment)
          </Field.Description>
          <Field.Error />
        </Field.Root>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Calculating..." : "Get Pre-Qualification"}
        </Button>
      </Form>
    </div>
  );
}
