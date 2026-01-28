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

  "/auth/forgotPassword": {
    success: boolean;
    message: string;
    data?: {
      otpSent?: boolean;
    };
  };

  "/auth/verifyOtp": {
  success: boolean;
  message: string;
  data: {
    update: {  // ← Changed from "updatedUser" to "update"
      id: string;
      email: string;
      emailVerified: boolean;
      image: string | null;
      password: string;
      name: string;
      role: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
      refreshToken: string;
    };
    emailVerified: boolean;
    resetToken: string;  // ← This is the JWT token to use!
  };
};

  "/auth/resendOtp": {
    success: boolean;
    message: string;
  };

  "/auth/resetPassword": {
    success: boolean;
    message: string;
    data: {
      id: string;
      name: string;
      email: string;
      emailVerified: boolean;
      image: string | null;
      password: string;
      role: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
      refreshToken: string | null;
    };
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