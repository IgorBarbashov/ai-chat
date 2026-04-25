import { useState } from "react";
import {
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
import styles from "./AppLayout.module.css";

export const AppLayout = () => {
  const [opened, setOpened] = useState(false);
  const [activeChatId, setActiveChatId] = useState(chats[0].id);
  const [messagesByChat] = useState<Record<string, ChatMessage[]>>({});
  const [isLoading] = useState(false);

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
              loading={isLoading}
            />

          <InputArea
            onSend={(message) => {
              console.log("Send message:", message);
            }}
          />
        </div>
      </AppShell.Main>
    </AppShell>
  );
};