import { useCallback, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";

type UseInputAreaParams = {
    onSend: (message: string) => void;
};

export const useInputArea = ({ onSend }: UseInputAreaParams) => {
    const [value, setValue] = useState("");

    const trimmedValue = useMemo(() => value.trim(), [value]);
    const canSend = trimmedValue.length > 0;

    const handleChange = useCallback((nextValue: string) => {
        setValue(nextValue);
    }, []);

    const submit = useCallback(() => {
        if (!canSend) return;

        onSend?.(trimmedValue);
        setValue("");
    }, [canSend, onSend, trimmedValue]);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLTextAreaElement>) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submit();
            }
        },
        [submit]
    );

    const handleStop = useCallback(() => {
        // заглушка под будущую остановку генерации
    }, []);

    const handleAttachImage = useCallback(() => {
        // заглушка под будущее прикрепление изображения
    }, []);

    return {
        value,
        canSend,
        handleChange,
        handleKeyDown,
        submit,
        handleStop,
        handleAttachImage,
    };
};