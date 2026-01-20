"use client";

import { useState } from "react";
import ProfileSettings from "./ProfileSettings";
import SecuritySettings from "./SecuritySettings";
import clsx from "clsx";

type TabType = "profile" | "security";

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  return (
      <div className="w-full px-10 py-8 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold -mt-2.5">Settings</h1>
        <p className="text-md font-medium text-muted-foreground mt-1">
          Update your profile and manage account security
        </p>
      </div>

      {/* Tabs (pill style like screenshot) */}
      <div className="flex rounded-xl bg-muted p-1 w-full max-w-md">
        <TabButton
          active={activeTab === "profile"}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </TabButton>

        <TabButton
          active={activeTab === "security"}
          onClick={() => setActiveTab("security")}
        >
          Account & Security
        </TabButton>
      </div>

      {/* Content */}
      <div>
        {activeTab === "profile" && <ProfileSettings />}
        {activeTab === "security" && <SecuritySettings />}
      </div>
    </div>
  );
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}
