import { ActionIcon, Button, Group, Textarea } from "@mantine/core";
import { IconPhoto, IconPlayerStopFilled, IconSend } from "@tabler/icons-react";
import { useInputArea } from "./useInputArea";
import styles from "./InputArea.module.css";
import type { InputAreaProps } from "./InputArea.models";

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
            <Textarea
                classNames={{
                    root: styles.textareaRoot,
                    input: styles.textareaInput,
                }}
                placeholder="Введите сообщение"
                autosize
                minRows={1}
                maxRows={5}
                value={value}
                onChange={(event) => handleChange(event.currentTarget.value)}
                onKeyDown={handleKeyDown}
            />

            <div className={styles.actionsRow}>
                <ActionIcon
                    variant="subtle"
                    size="lg"
                    aria-label="Прикрепить изображение"
                    onClick={handleAttachImage}
                >
                    <IconPhoto size={18} />
                </ActionIcon>

                <Group gap="xs">
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
                </Group>
            </div>
        </div>
    );
};