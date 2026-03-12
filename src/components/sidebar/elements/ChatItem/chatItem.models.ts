import type { Chat } from "@entities/chat"

export interface ChatItemProps {
  chat: Chat;
  active?: boolean;
  onClick?: () => void;
};
