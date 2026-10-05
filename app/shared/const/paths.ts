export const Paths = {
  INDEX: "/",
  SIGN_IN: "/auth/sign-in",
  SIGN_UP: "/auth/sign-up",
  COURTS: "/courts",
  COURT: (id: string) => `/courts/${id}`,
};

export const DEFAULT_PATH = Paths.COURTS;
