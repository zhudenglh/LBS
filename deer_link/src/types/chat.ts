// Chat Related Types

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export type ChatRole = 'user' | 'assistant' | 'system';
