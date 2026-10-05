export const UserRole = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
};

export type SignInDTO = {
  email: string;
  password: string;
};

export type SignUpDTO = SignInDTO & {
  firstName: string;
  lastName: string;
};
