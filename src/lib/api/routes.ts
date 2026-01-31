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
      update: {
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
      resetToken: string;
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

  // USER PROFILE ENDPOINTS
  "/api/user/editUser": {
    success: boolean;
    message: string;
    data?: {
      user?: {
        id: string;
        name: string;
        email: string;
        image?: string | null;
      };
      emailChangePending?: boolean;
    };
  };

  "/api/user/userProfileImage": {
    updatedUser: {
      id: string;
      name: string;
      email: string;
      emailVerified: boolean;
      image: string;
      password: string;
      role: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
      refreshToken: string;
    };
    message: string;
    image: string;
  };

  // GET USER BY ID - NEW ENDPOINT
  "/api/user/getUserById/:id": {
    success: boolean;
    message: string;
    data: {
      id: string;
      name: string;
      email: string;
      image: string | null;
      role: string;
      createdAt: string;
      updatedAt: string;
    };
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