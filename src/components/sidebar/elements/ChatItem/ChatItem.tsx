import { Box, Group, Text, ActionIcon } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import type { ChatItemProps } from "./chatItem.models";
import styles from "./chatItem.module.css";

export const ChatItem = ({ chat, active, onClick }: ChatItemProps) => {
  return (
    <Box
      onClick={onClick}
      className={`${styles.root} ${active ? styles.rootActive : ""}`}
    >
      <Group wrap="nowrap" align="center" gap="xs">
        <Box className={styles.content}>
          <Text size="sm" fw={500} truncate="end" title={chat.title}>
            {chat.title}
          </Text>
          <Text size="xs" c="dimmed">
            {chat.lastMessageDate}
          </Text>
        </Box>

        <Group gap={4} className={styles.actions}>
          <ActionIcon size="sm" variant="subtle" aria-label="Редактировать чат">
            <IconPencil size={14} />
          </ActionIcon>
          <ActionIcon
            size="sm"
            variant="subtle"
            color="red"
            aria-label="Удалить чат"
          >
            <IconTrash size={14} />
          </ActionIcon>
        </Group>
      </Group>
    </Box>
  );
};
