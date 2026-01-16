"use client";

import { X } from "lucide-react";

interface LogoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ open, onClose, onConfirm }: LogoutModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative w-90 rounded-xl bg-[#2A2A2A] border border-white/10 p-6">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/60 hover:text-white"
        >
          <X size={18} />
        </button>

        {/* Content */}
        <h2 className="text-lg font-semibold text-[#E96559] mb-2">Logout</h2>
        <p className="text-sm text-white/70 mb-6">
          Are you sure you want to logout?
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm bg-white/5 text-white hover:bg-white/10"
          >
            No
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm bg-[#eb4637] text-[#ffffff] font-medium hover:opacity-90"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
