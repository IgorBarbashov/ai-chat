import type { Chat } from '@entities/chat';

export interface ChatListProps {
  chats: Chat[];
  activeChatId: string;
  onChatClick: (id: string) => void;
};
