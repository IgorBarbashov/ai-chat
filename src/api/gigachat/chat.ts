import { getToken } from './auth';
import type { GigaChatMessage, StreamChunk, StreamOptions } from './gigachat.models';

export async function* streamCompletion(
  messages: GigaChatMessage[],
  signal: AbortSignal,
  options: StreamOptions = {}
): AsyncGenerator<string> {
  const response = await fetch('/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      model: 'GigaChat',
      messages,
      stream: true,
      ...options,
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`GigaChat API error: ${response.status} ${response.statusText}`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split('\n\n');
      buffer = parts.pop() ?? '';

      for (const part of parts) {
        const line = part.trim();
        if (!line.startsWith('data:')) continue;

        const data = line.slice(5).trim();
        if (data === '[DONE]') return;

        try {
          const parsed: StreamChunk = JSON.parse(data);
          const content = parsed.choices[0]?.delta?.content;
          if (content) yield content;
        } catch {
          // skip malformed chunks
        }
      }

      if (signal.aborted) break;
    }
  } finally {
    reader.releaseLock();
  }
}
