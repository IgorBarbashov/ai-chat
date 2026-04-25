import { useState } from "react";
import { ActionIcon, Box, Group, Text, TextInput } from "@mantine/core";
import { IconCheck, IconPencil, IconTrash, IconX } from "@tabler/icons-react";
import type { ChatItemProps } from "./chatItem.models";
import styles from "./chatItem.module.css";

export const ChatItem = ({ chat, active, onClick, onEdit, onDelete }: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(chat.title);

  const startEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditValue(chat.title);
    setIsEditing(true);
  };

  const saveEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed) onEdit?.(trimmed);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") cancelEdit();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Удалить чат «${chat.title}»?`)) {
      onDelete?.();
    }
  };

  if (isEditing) {
    return (
      <Box className={`${styles.root} ${active ? styles.rootActive : ""}`}>
        <Group wrap="nowrap" align="center" gap="xs">
          <TextInput
            value={editValue}
            onChange={(e) => setEditValue(e.currentTarget.value)}
            onKeyDown={handleKeyDown}
            onBlur={saveEdit}
            autoFocus
            size="xs"
            style={{ flex: 1 }}
          />
          <Group gap={4}>
            <ActionIcon size="sm" variant="subtle" color="green" onMouseDown={saveEdit} aria-label="Сохранить">
              <IconCheck size={14} />
            </ActionIcon>
            <ActionIcon size="sm" variant="subtle" onMouseDown={cancelEdit} aria-label="Отмена">
              <IconX size={14} />
            </ActionIcon>
          </Group>
        </Group>
      </Box>
    );
  }

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
          <ActionIcon size="sm" variant="subtle" aria-label="Редактировать чат" onClick={startEdit}>
            <IconPencil size={14} />
          </ActionIcon>
          <ActionIcon size="sm" variant="subtle" color="red" aria-label="Удалить чат" onClick={handleDelete}>
            <IconTrash size={14} />
          </ActionIcon>
        </Group>
      </Group>
    </Box>
  );
};
