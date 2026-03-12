import type { Chat } from "@entities/chat"

export interface SidebarProps {
  chats: Chat[];
  activeChatId: string;
  onChatClick: (id: string) => void;
};
