import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form as BaseForm } from "@base-ui/react/form";
import { authClient } from "@/lib/auth-client";
import { z } from "zod";

const schema = z.object({
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
    const { error } = await authClient.signIn.email({
      email: result.data.email,
      password: result.data.password,
    });

    if (error) {
      return {
        errors: {},
        errorMessage: error.message || "Failed to sign in",
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

export function useSignInForm() {
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
      // Get session to check user role
      const { data: session } = await authClient.getSession();
      const isAdmin = session?.user?.role?.includes("admin");
      router.push(isAdmin ? "/admin/quotes" : "/quotes");
    }
  };

  return {
    errors,
    errorMessage,
    isLoading,
    handleSubmit,
  };
}
