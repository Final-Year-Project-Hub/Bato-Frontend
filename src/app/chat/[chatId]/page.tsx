import ChatInterface from "../components/ChatInterface";

interface PageProps {
  params: {
    chatId: string;
  };
}
export default async function Page(props: PageProps) {
  const { chatId } = await props.params;
  return <ChatInterface />;
}
