import type { Chat } from '@entities/chat';

export interface ChatListProps {
  chats: Chat[];
  activeChatId: string;
  onChatClick: (id: string) => void;
  onEditChat?: (id: string, title: string) => void;
  onDeleteChat?: (id: string) => void;
};
