export const ApiPaths = {
  AUTH_ME: "/auth/me",
  AUTH_SIGN_IN: "/auth/sign-in",
  AUTH_SIGN_UP: "/auth/sign-up",
  AUTH_LOGOUT: "/auth/logout",

  COURTS: "/courts",
  COURT: (id: string) => `/courts/${id}`,
  COURT_DEACTIVATE: (id: string) => `/courts/${id}/deactivate`,
};
