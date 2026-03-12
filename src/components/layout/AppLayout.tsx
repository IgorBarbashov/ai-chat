import { useState } from "react";
import {
  AppShell,
  Burger,
  Group,
  // MantineProvider,
  // Navbar,
  ScrollArea,
  Text,
  rem,
} from "@mantine/core";

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
        <Group h="100%" px="md">
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            hiddenFrom="sm"
            size="sm"
          />
          <Text fw={500}>Chat layout</Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <ScrollArea h={`calc(100vh - ${rem(60)})`}>
          <Text fw={500} mb="sm">
            Sidebar
          </Text>
          <Text size="sm">Тут список чатов, контакты и т.п.</Text>
        </ScrollArea>
      </AppShell.Navbar>

      <AppShell.Main>
        <Text fw={500} mb="sm">
          Chat area
        </Text>
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            height: "70vh",
            padding: 16,
          }}
        >
          Здесь будет ваш компонент чата
        </div>
      </AppShell.Main>
    </AppShell>
  );
};
