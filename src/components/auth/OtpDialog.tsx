"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState, useEffect, useRef } from "react";

interface OtpDialogProps {
  open: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
  onResend?: () => void;
}

export function OtpDialog({
  open,
  onClose,
  onVerify,
  onResend,
}: OtpDialogProps) {
  const [otp, setOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(30);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // OTP validity timer
  useEffect(() => {
    if (!open) return;

    const timeout = setTimeout(() => setOtpTimer(30), 0);

    timerRef.current = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timeout);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [open]);

  const handleResend = () => {
    if (!onResend) return;

    onResend();
    setOtp("");
    setOtpTimer(30);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          sm:max-w-105
          rounded-2xl
          border border-white/10
          bg-[#233845]/80
          backdrop-blur-lg
        "
      >
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-[#EC5D44]">
            Email Verification
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-center text-white font-semibold">
            Enter the 6-digit OTP sent to your email
          </p>

          {/* OTP Validity Timer */}
          <p className="text-center text-sm text-white/60">
            OTP expires in: <b>{otpTimer}s</b>
          </p>

          {/* OTP INPUT */}
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value: string) => {
                const numericValue = value.replace(/\D/g, "");
                setOtp(numericValue);
              }}
            >
              <InputOTPGroup className="gap-3">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="
                      h-12 w-12
                      rounded-lg
                      border border-white/20
                      bg-white/10
                      text-white
                      text-lg
                      focus:border-[#EC5D44]
                      focus:ring-2
                      focus:ring-[#EC5D44]/40
                    "
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Verify Button */}
          <Button
            className="
              w-full
              bg-[#EC5D44]
              hover:bg-[#EC5D44]/90
              text-white
            "
            disabled={otp.length !== 6 || otpTimer === 0}
            onClick={() => onVerify(otp)}
          >
            Verify OTP
          </Button>

          {/* Resend OTP Button */}
          <div className="text-center mt-2">
            <button
              onClick={handleResend}
              disabled={otpTimer > 0}
              className={`font-medium ${
                otpTimer > 0
                  ? "text-white/50 cursor-not-allowed"
                  : "text-[#EC5D44] hover:underline"
              }`}
            >
              Resend OTP
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
