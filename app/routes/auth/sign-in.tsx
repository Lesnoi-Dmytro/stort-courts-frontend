import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import { Link } from "react-router";
import { SeededAccountsHint } from "~/features/auth/SeededAccountsHint";
import { SignInForm } from "~/features/auth/SignInForm";
import { Paths } from "~/shared/const/paths";
import type { Route } from "./+types/sign-in";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Sign in | Courtly" }];
}

export default function SignIn() {
  return (
    <Card size="3">
      <Flex align="center" justify="between" mb="1">
        <Heading size="5">Welcome back</Heading>
        <SeededAccountsHint />
      </Flex>
      <Text as="p" size="2" color="gray" mb="5">
        Sign in to book courts and manage your bookings.
      </Text>
      <SignInForm />
      <Text as="p" size="2" color="gray" mt="4" align="center">
        Don't have an account?{" "}
        <Link to={Paths.SIGN_UP} className="font-medium text-(--accent-11)">
          Sign up
        </Link>
      </Text>
    </Card>
  );
}
