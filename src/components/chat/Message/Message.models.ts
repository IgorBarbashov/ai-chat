import type { MessageVariant } from "@components/chat/ChatWindow";

export interface MessageProps {
  id: string;
  author: string;
  text: string;
  variant: MessageVariant;
}
