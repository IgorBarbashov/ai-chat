import { ActionIcon, Tooltip } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import { useChatMessages } from "./useChatMessages";
import { useChatWindowState } from "./useChatWindowState";
import type { ChatWindowProps } from "./ChatWindow.models";
import { MessageList } from "@components/chat/MessageList";
import styles from "./ChatWindow.module.css";

export const ChatWindow = ({ activeChatId }: ChatWindowProps) => {
  const { messages, loading } = useChatMessages(activeChatId);
  const { title } = useChatWindowState(activeChatId);

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>

        <Tooltip label="Настройки чата" withArrow>
          <ActionIcon variant="subtle" size="sm" aria-label="Chat settings">
            <IconSettings size={16} />
          </ActionIcon>
        </Tooltip>
      </div>

      <MessageList messages={messages} loading={loading} />
    </div>
  );
};
