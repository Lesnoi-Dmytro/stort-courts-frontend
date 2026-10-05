export const Paths = {
  INDEX: "/",
  SIGN_IN: "/auth/sign-in",
  SIGN_UP: "/auth/sign-up",
  BOOKINGS: "/bookings",
  COURTS: "/courts",
  COURT_NEW: "/courts/new",
  COURT_ROUTE: "/courts/:id",
  COURT: (id: string) => `/courts/${id}`,
};

export const DEFAULT_PATH = Paths.COURTS;
