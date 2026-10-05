import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Flex, TextField } from "@radix-ui/themes";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { signInSchema, type SignInValues } from "~/schemas/auth";
import { AuthService } from "~/services/http";
import { DEFAULT_PATH } from "~/shared/const/paths";
import { useAuth } from "~/shared/context/auth-context";
import { showApiError } from "~/shared/lib/show-api-error";
import { FormField } from "../../shared/components/forms/FormField";

export function SignInForm() {
  const { refresh } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: SignInValues) => {
    try {
      await AuthService.signIn(values);
      await refresh();
      navigate(DEFAULT_PATH, { replace: true });
    } catch (error) {
      showApiError(error, {
        title: "Sign in failed",
        fallback: "Invalid email or password",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Flex direction="column" gap="4">
        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <TextField.Root
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register("email")}
          />
        </FormField>
        <FormField
          label="Password"
          htmlFor="password"
          error={errors.password?.message}
        >
          <TextField.Root
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
          />
        </FormField>
        <Button type="submit" loading={isSubmitting}>
          Sign in
        </Button>
      </Flex>
    </form>
  );
}
