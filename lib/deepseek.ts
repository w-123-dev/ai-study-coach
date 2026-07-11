const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1000;
const TIMEOUT_MS = 30000;

export class DeepSeekError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly retryable: boolean = false
  ) {
    super(message);
    this.name = "DeepSeekError";
  }
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryable(statusCode: number): boolean {
  return (
    statusCode === 429 ||
    statusCode === 500 ||
    statusCode === 502 ||
    statusCode === 503 ||
    statusCode === 504
  );
}

// ===== 单一提示调用（带系统提示词） =====

export async function callDeepSeek(
  prompt: string,
  options?: {
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new DeepSeekError("DEEPSEEK_API_KEY 未配置", undefined, false);
  }

  const systemPrompt =
    options?.systemPrompt ??
    "你是专业的考研规划师。只返回JSON，不要包含任何Markdown格式或额外的文字说明。";

  const temperature = options?.temperature ?? 0.7;
  const maxTokens = options?.maxTokens ?? 4096;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      const delay = INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt - 1);
      console.warn(
        `[DeepSeek] 重试第 ${attempt + 1} 次，等待 ${delay}ms...`
      );
      await sleep(delay);
    }

    try {
      const response = await fetchWithTimeout(
        DEEPSEEK_API_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: prompt },
            ],
            temperature,
            max_tokens: maxTokens,
          }),
        },
        TIMEOUT_MS
      );

      if (!response.ok) {
        const errorText = await response.text().catch(() => "未知错误");
        if (isRetryable(response.status) && attempt < MAX_RETRIES - 1) {
          lastError = new DeepSeekError(
            `DeepSeek API 错误 (${response.status}): ${errorText}`,
            response.status,
            true
          );
          continue;
        }
        throw new DeepSeekError(
          `DeepSeek API 错误 (${response.status}): ${errorText}`,
          response.status,
          false
        );
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new DeepSeekError("DeepSeek 返回内容为空", undefined, false);
      }

      return content;
    } catch (error) {
      if (error instanceof DeepSeekError) {
        if (error.retryable && attempt < MAX_RETRIES - 1) {
          lastError = error;
          continue;
        }
        throw error;
      }

      if (error instanceof DOMException && error.name === "AbortError") {
        if (attempt < MAX_RETRIES - 1) {
          lastError = new DeepSeekError("请求超时", undefined, true);
          continue;
        }
        throw new DeepSeekError(
          `请求超时，已重试 ${MAX_RETRIES} 次`,
          undefined,
          false
        );
      }

      if (attempt < MAX_RETRIES - 1) {
        lastError = error instanceof Error ? error : new Error(String(error));
        continue;
      }
      throw new DeepSeekError(
        `网络错误: ${error instanceof Error ? error.message : String(error)}`,
        undefined,
        false
      );
    }
  }

  throw lastError ?? new DeepSeekError("未知错误");
}

// ===== 多消息对话支持（用于 AI 聊天） =====

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function callDeepSeekChat(
  messages: ChatMessage[],
  options?: {
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new DeepSeekError("DEEPSEEK_API_KEY 未配置", undefined, false);
  }

  const temperature = options?.temperature ?? 0.7;
  const maxTokens = options?.maxTokens ?? 2048;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      const delay = INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt - 1);
      console.warn(
        `[DeepSeek Chat] 重试第 ${attempt + 1} 次，等待 ${delay}ms...`
      );
      await sleep(delay);
    }

    try {
      const response = await fetchWithTimeout(
        DEEPSEEK_API_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages,
            temperature,
            max_tokens: maxTokens,
          }),
        },
        TIMEOUT_MS
      );

      if (!response.ok) {
        const errorText = await response.text().catch(() => "未知错误");
        if (isRetryable(response.status) && attempt < MAX_RETRIES - 1) {
          lastError = new DeepSeekError(
            `DeepSeek API 错误 (${response.status}): ${errorText}`,
            response.status,
            true
          );
          continue;
        }
        throw new DeepSeekError(
          `DeepSeek API 错误 (${response.status}): ${errorText}`,
          response.status,
          false
        );
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new DeepSeekError("DeepSeek 返回内容为空", undefined, false);
      }

      return content;
    } catch (error) {
      if (error instanceof DeepSeekError) {
        if (error.retryable && attempt < MAX_RETRIES - 1) {
          lastError = error;
          continue;
        }
        throw error;
      }

      if (error instanceof DOMException && error.name === "AbortError") {
        if (attempt < MAX_RETRIES - 1) {
          lastError = new DeepSeekError("请求超时", undefined, true);
          continue;
        }
        throw new DeepSeekError(
          `请求超时，已重试 ${MAX_RETRIES} 次`,
          undefined,
          false
        );
      }

      if (attempt < MAX_RETRIES - 1) {
        lastError = error instanceof Error ? error : new Error(String(error));
        continue;
      }
      throw new DeepSeekError(
        `网络错误: ${error instanceof Error ? error.message : String(error)}`,
        undefined,
        false
      );
    }
  }

  throw lastError ?? new DeepSeekError("未知错误");
}
