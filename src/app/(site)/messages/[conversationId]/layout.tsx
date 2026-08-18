export async function generateStaticParams() {
  const { conversations } = await import("@/data/mock/conversations");
  return conversations.map((conversation) => ({
    conversationId: conversation.id,
  }));
}

export default function ConversationIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
