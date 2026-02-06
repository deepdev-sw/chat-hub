export interface ModelAdapter {
  name: string
  url: string
  // CSS to inject for better layout in small windows
  css?: string
  // Returns JavaScript code to execute to fill the input box
  getFillInputCode(text: string): string
  // Returns JavaScript code to execute to click the send button
  getSendCode(): string
  // Returns JavaScript code to reset/new chat
  getResetCode(): string
}

import { DeepSeekAdapter } from './deepseek'
import { QwenAdapter } from './qwen'

export const adapters: ModelAdapter[] = [
  new DeepSeekAdapter(),
  new QwenAdapter()
]
