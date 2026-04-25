import type { Chat } from "@entities/chat"

export interface SidebarProps {
  chats: Chat[];
  activeChatId: string;
  onChatClick: (id: string) => void;
  onNewChat?: () => void;
  onEditChat?: (id: string, title: string) => void;
  onDeleteChat?: (id: string) => void;
};
