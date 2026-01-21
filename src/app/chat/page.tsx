import ChatInterface from "./components/ChatInterface";

export default function Page() {

  return (
    <div className="flex min-h-screen  bg-background text-foreground overflow-hidden">

      {/* Chat Interface */}
      <ChatInterface />
    </div>
  );
}
