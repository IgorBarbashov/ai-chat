export type MessageVariant = "user" | "assistant";

export interface ChatMessage {
  id: string;
  chatId: string;
  author: string;
  variant: MessageVariant;
  text: string;
  createdAt: string;
}

export interface ChatWindowProps {
  activeChatId: string;
  title: string;
  messages: ChatMessage[];
}
