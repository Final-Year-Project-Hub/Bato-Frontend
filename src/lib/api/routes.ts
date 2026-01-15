// src/lib/api/routes.ts
export type ApiRoutes = {
  "/auth/signup": {
    success: boolean;
    message: string;
    data: {
      id: string;
      fullName: string;
      email: string;
      otps?: {
        purpose: "EMAIL_VERIFICATION" | string;
        expiresAt: string;
      }[];
    };
  };

  "/auth/login": {
    success: boolean;
    message: string;
    data: {
      accessToken: string;
      refreshToken: string;
    };
  };

   "/auth/verifyOtp": {
    success: boolean;
    message: string;
  };

    "/auth/resendOtp": {
    success: boolean;
    message: string;
  };
};
