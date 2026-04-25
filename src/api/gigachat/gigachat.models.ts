export type GigaChatRole = 'system' | 'user' | 'assistant';

export interface GigaChatMessage {
  role: GigaChatRole;
  content: string;
}

export interface StreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    delta: {
      role?: GigaChatRole;
      content?: string;
    };
    index: number;
    finish_reason: string | null;
  }>;
}

export interface StreamOptions {
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  repetition_penalty?: number;
}
