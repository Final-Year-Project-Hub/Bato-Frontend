import ChatSidebar from "./components/ChatSidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#1e1e1e] text-white">
      {/* Sidebar */}
      <ChatSidebar />

      {/* Page content (ChatInterface) */}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
