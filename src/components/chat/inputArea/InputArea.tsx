import { ActionIcon, Button, Textarea } from "@mantine/core";
import { IconPhoto, IconPlayerStopFilled, IconSend } from "@tabler/icons-react";
import { useInputArea } from "./useInputArea";
import type { InputAreaProps } from "./InputArea.models";
import styles from "./InputArea.module.css";

export const InputArea = ({ onSend }: InputAreaProps) => {
    const {
        value,
        canSend,
        handleChange,
        handleKeyDown,
        submit,
        handleStop,
        handleAttachImage,
    } = useInputArea({ onSend });

    return (
        <div className={styles.root}>
            <div className={styles.inner}>
                <div className={styles.field}>
                    <Textarea
                        classNames={{ input: styles.textarea }}
                        placeholder="Введите сообщение"
                        autosize
                        minRows={1}
                        maxRows={5}
                        value={value}
                        onChange={(event) => handleChange(event.currentTarget.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                <div className={styles.actions}>
                    <ActionIcon
                        variant="subtle"
                        size="lg"
                        aria-label="Прикрепить изображение"
                        onClick={handleAttachImage}
                    >
                        <IconPhoto size={18} />
                    </ActionIcon>

                    <Button
                        variant="light"
                        leftSection={<IconPlayerStopFilled size={14} />}
                        onClick={handleStop}
                    >
                        Стоп
                    </Button>

                    <Button
                        leftSection={<IconSend size={14} />}
                        onClick={submit}
                        disabled={!canSend}
                    >
                        Отправить
                    </Button>
                </div>
            </div>
        </div>
    );
};