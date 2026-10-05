export const ApiPaths = {
  AUTH_ME: "/auth/me",
  AUTH_SIGN_IN: "/auth/sign-in",
  AUTH_SIGN_UP: "/auth/sign-up",
  AUTH_LOGOUT: "/auth/logout",

  COURTS: "/courts",
  COURT: (id: string) => `/courts/${id}`,
  COURT_DEACTIVATE: (id: string) => `/courts/${id}/deactivate`,

  COURT_BOOKINGS: "/court-bookings",
  COURT_BOOKINGS_SUMMARY: "/court-bookings/summary",
  COURT_BOOKINGS_MY: "/court-bookings/my",
  COURT_BOOKINGS_BY_COURT: (courtId: string) =>
    `/court-bookings/court/${courtId}`,
  COURT_BOOKING: (id: string) => `/court-bookings/${id}`,
};
