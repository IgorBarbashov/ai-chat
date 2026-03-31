import type { ChatMessage } from "@components/chat/ChatWindow";

export interface MessageListProps {
  messages: ChatMessage[];
  loading: boolean;
}
