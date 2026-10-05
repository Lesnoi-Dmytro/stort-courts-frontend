import { Card, Heading, Text } from "@radix-ui/themes";
import { Link } from "react-router";
import { SignUpForm } from "~/features/auth/SignUpForm";
import { Paths } from "~/shared/const/paths";
import type { Route } from "./+types/sign-up";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Sign up | Courtly" }];
}

export default function SignUp() {
  return (
    <Card size="3">
      <Heading size="5" mb="1">
        Create an account
      </Heading>
      <Text as="p" size="2" color="gray" mb="5">
        Join Courtly to start booking sports courts.
      </Text>
      <SignUpForm />
      <Text as="p" size="2" color="gray" mt="4" align="center">
        Already have an account?{" "}
        <Link to={Paths.SIGN_IN} className="font-medium text-(--accent-11)">
          Sign in
        </Link>
      </Text>
    </Card>
  );
}
