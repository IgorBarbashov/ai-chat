import { useEffect, useRef } from "react";
import { ScrollArea, Text } from "@mantine/core";
import { Message } from "@components/chat/Message";
import type { MessageListProps } from "./MessageList.models";
import styles from "./MessageList.module.css";

export const MessageList = ({ messages }: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className={styles.messages} scrollbarSize={6} type="hover">
      {messages.length === 0 ? (
        <Text c="dimmed" ta="center">Начните диалог</Text>
      ) : (
        messages.map((message) => (
          <div key={message.id} className={styles.messageRow}>
            <Message
              id={message.id}
              author={message.author}
              text={message.text}
              variant={message.variant}
            />
          </div>
        ))
      )}
      <div ref={bottomRef} />
    </ScrollArea>
  );
};
