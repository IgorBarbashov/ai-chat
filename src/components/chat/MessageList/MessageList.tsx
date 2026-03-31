import { Loader, ScrollArea } from "@mantine/core";
import type { MessageListProps } from "./MessageList.models";
import styles from "./MessageList.module.css";

export const MessageList = ({ messages, loading }: MessageListProps) => {
  return (
    <ScrollArea className={styles.messages} scrollbarSize={6} type="hover">
      {loading && <Loader size="xs" />}

      {!loading &&
        messages.map((message) => {
          const isUser = message.variant === "user";

          if (isUser) {
            return (
              <div
                key={message.id}
                className={`${styles.messageRow} ${styles.messageUser}`}
              >
                <div
                  className={`${styles.messageBubble} ${styles.messageBubbleUser}`}
                >
                  {message.text}
                </div>
              </div>
            );
          }

          return (
            <div
              key={message.id}
              className={`${styles.messageRow} ${styles.messageAssistant}`}
            >
              <div className={styles.assistantRowContent}>
                <div className={styles.assistantAvatar}>G</div>
                <div
                  className={`${styles.messageBubble} ${styles.messageBubbleAssistant}`}
                >
                  {message.text}
                </div>
              </div>
            </div>
          );
        })}
    </ScrollArea>
  );
};
