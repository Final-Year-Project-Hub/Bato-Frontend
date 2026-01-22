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

  "/auth/logout": {
    success: boolean;
    message: string;
  };

  // ROADMAP LIST
  "/api/roadmap": {
    success: boolean;
    message: string;
    data: {
      id: string;
      title: string;
      goal: string;
      proficiency: string;
      createdAt: string;
      isSelected: boolean;
    }[];
  };
  "/api/roadmap/:id": {
    success: boolean;
    message: string;
    data: {
      id: string;
      userId: string;
      chatSessionId: string;
      title: string;
      goal: string;
      intent: string;
      proficiency: string;
      roadmapData: Record<string, unknown>;
      message: string;
      isSelected: boolean;
      createdAt: string;
      updatedAt: string;
    };
  };
};
