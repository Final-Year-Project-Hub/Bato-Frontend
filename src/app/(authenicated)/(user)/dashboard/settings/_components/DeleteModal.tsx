"use client";

import { X } from "lucide-react";

interface DeleteAccountModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteAccountModal({
  open,
  onClose,
  onConfirm,
}: DeleteAccountModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative w-95 rounded-xl bg-[#2A2A2A] border border-white/10 p-6">
     
        

        {/* Content */}
       

        <p className="text-lg font-semibold text-[#eb4637] mb-2">
          Are you sure you want to delete your account?
        </p>

        <p className="text-sm text-white/50 mb-6">
          Deleting your account will permanently erase all your data and cannot
          be undone.
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm bg-white/5 text-white hover:bg-white/10"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm bg-[#eb4637] text-white font-medium hover:opacity-90"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
