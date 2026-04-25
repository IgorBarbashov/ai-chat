export type InputAreaProps = {
    onSend: (message: string) => void;
    onStop?: () => void;
    isStreaming?: boolean;
};
