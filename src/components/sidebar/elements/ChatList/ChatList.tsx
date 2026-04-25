import { Stack } from "@mantine/core";
import { ChatItem } from "../ChatItem";
import type { ChatListProps } from "./chatList.models";

export const ChatList = ({
  chats,
  activeChatId,
  onChatClick,
  onEditChat,
  onDeleteChat,
}: ChatListProps) => {
  return (
    <Stack gap="xs">
      {chats.map((chat) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          active={chat.id === activeChatId}
          onClick={() => onChatClick(chat.id)}
          onEdit={(title) => onEditChat?.(chat.id, title)}
          onDelete={() => onDeleteChat?.(chat.id)}
        />
      ))}
    </Stack>
  );
};
