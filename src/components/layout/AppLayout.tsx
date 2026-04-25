import { useRef, useState } from "react";
import {
  Alert,
  AppShell,
  Burger,
  Group,
  ScrollArea,
  Text,
  rem,
} from "@mantine/core";
import { Sidebar } from "@components/sidebar";
import { ThemeToggle } from "@components/themeToggle";
import { chats } from "@mocks/chats";
import { InputArea } from "@components/chat/InputArea";
import { ChatWindow } from "@components/chat/ChatWindow";
import type { ChatMessage } from "@components/chat/ChatWindow";
import { streamCompletion } from "../../api/gigachat";
import type { GigaChatMessage } from "../../api/gigachat";
import styles from "./AppLayout.module.css";

export const AppLayout = () => {
  const [opened, setOpened] = useState(false);
  const [activeChatId, setActiveChatId] = useState(chats[0].id);
  const [messagesByChat, setMessagesByChat] = useState<Record<string, ChatMessage[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const handleSend = async (text: string) => {
    const chatId = activeChatId;
    const prevMessages = messagesByChat[chatId] ?? [];

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      chatId,
      author: "Вы",
      variant: "user",
      text,
      createdAt: new Date().toISOString(),
    };
    const assistantMsg: ChatMessage = {
      id: crypto.randomUUID(),
      chatId,
      author: "GigaChat",
      variant: "assistant",
      text: "",
      createdAt: new Date().toISOString(),
    };

    setMessagesByChat((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] ?? []), userMsg, assistantMsg],
    }));

    setError(null);
    setIsLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;

    const apiMessages: GigaChatMessage[] = [
      ...prevMessages.map((m) => ({ role: m.variant, content: m.text })),
      { role: "user", content: text },
    ];

    try {
      for await (const token of streamCompletion(apiMessages, controller.signal)) {
        setMessagesByChat((prev) => {
          const msgs = prev[chatId] ?? [];
          const last = msgs[msgs.length - 1];
          if (!last) return prev;
          return {
            ...prev,
            [chatId]: [...msgs.slice(0, -1), { ...last, text: last.text + token }],
          };
        });
      }
    } catch (e) {
      if (controller.signal.aborted) return;
      setError(e instanceof Error ? e.message : "Ошибка соединения");
      setMessagesByChat((prev) => ({
        ...prev,
        [chatId]: (prev[chatId] ?? []).slice(0, -1),
      }));
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  return (
    <AppShell
      padding="md"
      navbar={{
        width: { base: 260 },
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      header={{ height: 60 }}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              hiddenFrom="sm"
              size="sm"
            />
            <Text fw={500}>Chat layout</Text>
          </Group>

          <ThemeToggle />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <ScrollArea h={`calc(100vh - ${rem(60)})`}>
          <Sidebar
            chats={chats}
            activeChatId={activeChatId}
            onChatClick={setActiveChatId}
          />
        </ScrollArea>
      </AppShell.Navbar>

      <AppShell.Main>
        <div className={styles.main}>
          <ChatWindow
              activeChatId={activeChatId}
              messages={messagesByChat[activeChatId] ?? []}
            />

          {error && (
            <Alert color="red" title="Ошибка" withCloseButton onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <InputArea
              onSend={handleSend}
              onStop={() => abortRef.current?.abort()}
              isStreaming={isLoading}
            />
        </div>
      </AppShell.Main>
    </AppShell>
  );
};