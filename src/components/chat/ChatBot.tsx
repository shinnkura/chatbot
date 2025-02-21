/**
 * チャットボットコンポーネント
 * @file チャットボットのメインコンポーネント
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { ChatMessage as ChatMessageType, ChatState, QuestionType } from "../../types/chat";
import { questions } from "../../data/questions";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

const INITIAL_MESSAGE: ChatMessageType = {
  id: "initial",
  sender: "bot",
  content: "こんにちは！保育士様の転職相談を承ります。以下の質問にお答えいただけますでしょうか？",
};

/**
 * メッセージIDを生成する
 */
function generateMessageId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * 指定時間待機する
 */
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 回答に対する応答メッセージを生成する
 */
function generateResponseMessage(questionType: string): string {
  const responses = [
    "ご回答ありがとうございます。",
    "承知いたしました。",
    "ご協力ありがとうございます。",
    "かしこまりました。",
    "ご回答、大変参考になります。",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * チャットボットのメインコンポーネント
 */
export function ChatBot() {
  const [state, setState] = useState<ChatState>({
    messages: [INITIAL_MESSAGE],
    currentQuestionIndex: 0,
    answers: {},
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  /**
   * 新しいメッセージを追加する
   */
  const addMessage = (message: ChatMessageType) => {
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  /**
   * 回答を処理する
   */
  const handleAnswer = async (answer: string | string[]) => {
    if (isProcessing) return;
    setIsProcessing(true);

    const currentQuestion = questions[state.currentQuestionIndex];
    let displayAnswer = answer;

    // 選択式の場合は、ラベルを表示用の回答として使用
    if (currentQuestion.type === QuestionType.SELECT && currentQuestion.options) {
      const selectedOption = currentQuestion.options.find((opt) => opt.value === answer);
      if (selectedOption) {
        displayAnswer = selectedOption.label;
      }
    }

    // ユーザーの回答をメッセージとして追加
    addMessage({
      id: generateMessageId("user"),
      sender: "user",
      content: Array.isArray(displayAnswer) ? displayAnswer.join("、") : displayAnswer,
    });

    // 回答を保存
    setState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQuestion.id]: answer,
      },
    }));

    // 応答メッセージを表示
    await sleep(600);
    addMessage({
      id: generateMessageId("response"),
      sender: "bot",
      content: generateResponseMessage(currentQuestion.type),
    });

    // 次の質問へ進む
    await sleep(800);
    handleNextQuestion();
    setIsProcessing(false);
  };

  /**
   * 質問をスキップする
   */
  const handleSkip = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    const currentQuestion = questions[state.currentQuestionIndex];

    addMessage({
      id: generateMessageId("skip"),
      sender: "user",
      content: "スキップ",
    });

    await sleep(600);
    addMessage({
      id: generateMessageId("response"),
      sender: "bot",
      content: "承知いたしました。",
    });

    await sleep(800);
    handleNextQuestion();
    setIsProcessing(false);
  };

  /**
   * 次の質問を表示する
   */
  const handleNextQuestion = () => {
    const nextIndex = state.currentQuestionIndex + 1;

    if (nextIndex < questions.length) {
      const nextQuestion = questions[nextIndex];
      addMessage({
        id: generateMessageId("question"),
        sender: "bot",
        content: nextQuestion.text,
        question: nextQuestion,
      });

      setState((prev) => ({
        ...prev,
        currentQuestionIndex: nextIndex,
      }));
    } else {
      // 全質問完了
      addMessage({
        id: generateMessageId("completion"),
        sender: "bot",
        content:
          "ご回答いただき、ありがとうございました。お客様の希望に沿った求人をお探しいたしますので、少々お待ちください。",
      });

      // ここでAPIを呼び出して求人を検索する処理を追加
    }
  };

  /**
   * チャットが更新されたらスクロールを一番下に移動
   */
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [state.messages]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="bg-primary text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">保育士転職相談</h1>
          <p className="text-sm mt-2 text-primary-foreground/90">あなたに合った保育園をご紹介させていただきます</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-secondary/30">
        <div className="h-full max-w-4xl mx-auto px-4">
          <div ref={chatContainerRef} className="h-full overflow-y-auto py-6 space-y-6">
            {state.messages.map((message) => (
              <div key={message.id} className="animate-slide-in">
                <ChatMessage message={message} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t bg-background/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <ChatInput
            currentQuestion={
              state.currentQuestionIndex < questions.length ? questions[state.currentQuestionIndex] : undefined
            }
            onSubmit={handleAnswer}
            onSkip={handleSkip}
            disabled={isProcessing}
          />
        </div>
      </div>
    </div>
  );
}
