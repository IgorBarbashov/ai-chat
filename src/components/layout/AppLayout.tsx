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
import { chats, activeChatId, onChatClick } from "@mocks/chats";
import { InputArea } from "@components/chat/inputArea";
import styles from "./AppLayout.module.css";

export const AppLayout = () => {
  const [opened, setOpened] = useState(false);

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
            onChatClick={onChatClick}
          />
        </ScrollArea>
      </AppShell.Navbar>

      <AppShell.Main>
        <div className={styles.main}>
          <Text fw={500} mb="sm">
            Chat area
          </Text>

          <div className={styles.chatWindow}>
            Здесь будет ваш компонент чата (активный id: {activeChatId})
          </div>

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