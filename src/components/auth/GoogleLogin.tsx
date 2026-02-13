import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";
import { toast } from "sonner";

const handleGoogleLogin = async () => {
  console.log("[Google Login] Started");
  const toastId = toast.loading("Connecting to Google...");

  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://bato-backend-a9x8.onrender.com";

    console.log("[Google Login] Backend URL:", backendUrl);
    console.log("[Google Login] Fetching from:", `${backendUrl}/auth/google`);
    window.location.href = `${backendUrl}/auth/google`;
  } catch (error) {
   toast.error("Failed to initiate Google login. Please try again.", { id: toastId });

    const err = error as Error;

    if (err.message.includes("CORS") || err.message.includes("fetch")) {
      toast.error("Connection blocked", {
        id: toastId,
        description: "CORS policy blocking request. Contact support.",
      });
    } else {
      toast.error("Connection failed", {
        id: toastId,
        description: err.message || "Please check your internet connection",
      });
    }
  }
};

export default function GoogleLogin() {
  return (
    <Button
      onClick={handleGoogleLogin}
      type="button"
      className="w-full h-10 bg-grey text-foreground flex items-center justify-center gap-3 hover:bg-grey/80 font-medium mt-4 border border-border"
    >
      <FcGoogle size={18} /> Google
    </Button>
  );
}
