/**
 * チャットメッセージコンポーネント
 * @file チャットメッセージを表示するコンポーネント
 */

import { ChatMessage as ChatMessageType } from "../../types/chat";
import { cn } from "../../lib/utils";

interface ChatMessageProps {
  /** メッセージデータ */
  message: ChatMessageType;
}

/**
 * チャットメッセージを表示するコンポーネント
 */
export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.sender === "bot";

  return (
    <div className={cn("flex w-full gap-2 md:gap-4", isBot ? "justify-start" : "justify-end")}>
      {isBot && (
        <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-primary text-base md:text-lg font-bold">🤖</span>
        </div>
      )}
      <div
        className={cn(
          "relative group max-w-[85%] md:max-w-[80%] rounded-2xl p-3 md:p-4 shadow-md transition-all duration-200",
          isBot ? "bg-white text-foreground rounded-tl-sm" : "bg-primary text-primary-foreground rounded-tr-sm"
        )}
      >
        <div className="relative z-10">
          <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
          {message.description && <p className="text-xs md:text-sm mt-1.5 md:mt-2 opacity-80">{message.description}</p>}
        </div>
        <div
          className={cn(
            "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200",
            isBot ? "bg-secondary/50 border border-border" : "bg-primary-foreground/5"
          )}
        />
      </div>
      {!isBot && (
        <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center">
          <span className="text-primary-foreground text-xs md:text-sm font-bold">You</span>
        </div>
      )}
    </div>
  );
}
