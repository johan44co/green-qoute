import { authClient } from "@/lib/auth-client";
import { Form as BaseForm } from "@base-ui/react/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

async function submitForm(formValues: BaseForm.Values) {
  const result = schema.safeParse(formValues);

  if (!result.success) {
    return {
      errors: z.flattenError(result.error).fieldErrors,
    };
  }

  try {
    const { error } = await authClient.signUp.email({
      name: result.data.name,
      email: result.data.email,
      password: result.data.password,
    });

    if (error) {
      return {
        errors: {},
        errorMessage: error.message || "Failed to sign up",
      };
    }

    return { errors: {}, errorMessage: null };
  } catch (err) {
    return {
      errors: {},
      errorMessage: "An unexpected error occurred. Please try again.",
    };
  }
}

export function useSignUpForm() {
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formValues: BaseForm.Values) => {
    setIsLoading(true);
    setErrorMessage(null);
    const response = await submitForm(formValues);
    setErrors(response.errors);
    setErrorMessage(response.errorMessage || null);
    setIsLoading(false);

    if (Object.keys(response.errors).length === 0 && !response.errorMessage) {
      router.push("/quotes");
    }
  };

  return {
    errors,
    errorMessage,
    isLoading,
    handleSubmit,
  };
}
