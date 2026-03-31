import { useMemo } from "react";
import { chats } from "@mocks/chats";

export const useChatWindowState = (activeChatId: string) => {
  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId) ?? null,
    [activeChatId]
  );

  const title = activeChat?.title ?? "Выберите чат";

  return { activeChat, title };
};
