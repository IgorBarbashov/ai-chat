import { useMemo, useState } from "react";
import { Button, Stack, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { SearchInput, ChatList } from "./elements";
import type { SidebarProps } from "./sidebar.models";

export const Sidebar = ({ chats, activeChatId, onChatClick }: SidebarProps) => {
  const [query, setQuery] = useState("");

  const filteredChats = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter((chat) =>
      chat.title.toLowerCase().includes(q)
    );
  }, [chats, query]);

  return (
    <Stack gap="md">
      <Title order={4}>Чаты</Title>

      <Button
        leftSection={<IconPlus size={16} />}
        variant="filled"
        size="xs"
      >
        Новый чат
      </Button>

      <SearchInput value={query} onChange={setQuery} />

      <ChatList
        chats={filteredChats}
        activeChatId={activeChatId}
        onChatClick={onChatClick}
      />
    </Stack>
  );
};
