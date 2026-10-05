import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Flex, TextField } from "@radix-ui/themes";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { signUpSchema, type SignUpValues } from "~/schemas/auth";
import { AuthService } from "~/services/http";
import { DEFAULT_PATH } from "~/shared/const/paths";
import { useAuth } from "~/shared/context/auth-context";
import { showApiError } from "~/shared/lib/show-api-error";
import { FormField } from "../../shared/components/forms/FormField";

export function SignUpForm() {
  const { refresh } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async ({ confirmPassword: _, ...dto }: SignUpValues) => {
    try {
      await AuthService.signUp(dto);
      await refresh();
      navigate(DEFAULT_PATH, { replace: true });
    } catch (error) {
      showApiError(error, {
        title: "Sign up failed",
        fallback: "Could not create the account",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Flex direction="column" gap="4">
        <Flex gap="3">
          <div className="flex-1">
            <FormField
              label="First name"
              htmlFor="firstName"
              error={errors.firstName?.message}
            >
              <TextField.Root
                id="firstName"
                autoComplete="given-name"
                {...register("firstName")}
              />
            </FormField>
          </div>
          <div className="flex-1">
            <FormField
              label="Last name"
              htmlFor="lastName"
              error={errors.lastName?.message}
            >
              <TextField.Root
                id="lastName"
                autoComplete="family-name"
                {...register("lastName")}
              />
            </FormField>
          </div>
        </Flex>
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
            autoComplete="new-password"
            {...register("password")}
          />
        </FormField>
        <FormField
          label="Confirm password"
          htmlFor="confirmPassword"
          error={errors.confirmPassword?.message}
        >
          <TextField.Root
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
        </FormField>
        <Button type="submit" loading={isSubmitting}>
          Create account
        </Button>
      </Flex>
    </form>
  );
}
