module.exports = {
  // Organization errors
  ORG_ALREADY_EXISTS: {
    code: "ORG_1001",
    message: "Organization already exists.",
  },
  ORG_NOT_FOUND: {
    code: "ORG_1002",
    message: "Organization not found.",
  },
  INVALID_ORG_NAME: {
    code: "ORG_1003",
    message: "Invalid organization name.",
  },

  INVALID_ADMIN_CREDENTIALS: {
    code: "AUTH_2001",
    message: "Invalid email or password.",
  },
  UNAUTHORIZED: {
    code: "AUTH_2002",
    message: "Unauthorized access.",
  },

  INVALID_EMAIL_FORMAT: {
    code: "AUTH_2003",
    message: "Invalid email format.",
  },

  INVALID_PASSWORD_FORMAT: {
    code: "AUTH_2004",
    message: "Password must be at least 8 characters long.",
  },

  INTERNAL_ERROR: {
    code: "SYS_5000",
    message: "An internal server error occurred.",
  },
};
