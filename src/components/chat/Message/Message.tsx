import { ActionIcon, Loader, Tooltip } from "@mantine/core";
import { IconCopy } from "@tabler/icons-react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import type { MessageProps } from "./Message.models";
import styles from "./Message.module.css";

export const Message = ({ id, author, text, variant }: MessageProps) => {
  const isUser = variant === "user";

  const handleCopy = () => {
    if (!navigator.clipboard) {
      return;
    }

    navigator.clipboard.writeText(text).catch(() => {
      if (import.meta.env.DEV) {
        console.warn("Failed to copy message", id);
      }
    });
  };

  if (isUser) {
    return (
      <div className={`${styles.root} ${styles.rootUser}`} data-id={id}>
        <div className={`${styles.bubble} ${styles.bubbleUser}`}>
          <div className={styles.header}>{author}</div>
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{text}</ReactMarkdown>

          <Tooltip label="Копировать" withArrow>
            <ActionIcon
              size="xs"
              variant="subtle"
              aria-label="Копировать сообщение"
              className={styles.copyButton}
              onClick={handleCopy}
            >
              <IconCopy size={14} />
            </ActionIcon>
          </Tooltip>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.root} ${styles.rootAssistant}`} data-id={id}>
      <div className={styles.assistantRowContent}>
        <div className={styles.assistantAvatar}>G</div>
        <div className={`${styles.bubble} ${styles.bubbleAssistant}`}>
          <div className={styles.header}>{author}</div>
          {text === "" ? <Loader size="xs" /> : <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{text}</ReactMarkdown>}

          <Tooltip label="Копировать" withArrow>
            <ActionIcon
              size="xs"
              variant="subtle"
              aria-label="Копировать сообщение"
              className={styles.copyButton}
              onClick={handleCopy}
            >
              <IconCopy size={14} />
            </ActionIcon>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
