import { Loader, ScrollArea } from "@mantine/core";
import { Message } from "@components/chat/Message";
import type { MessageListProps } from "./MessageList.models";
import styles from "./MessageList.module.css";

export const MessageList = ({ messages, loading }: MessageListProps) => {
  return (
    <ScrollArea className={styles.messages} scrollbarSize={6} type="hover">
      {loading && <Loader size="xs" />}

      {!loading &&
        messages.map((message) => {
          return (
            <div
              key={message.id}
              className={styles.messageRow}
            >
              <Message
                id={message.id}
                author={message.author}
                text={message.text}
                variant={message.variant}
              />
            </div>
          );
        })}
    </ScrollArea>
  );
};
