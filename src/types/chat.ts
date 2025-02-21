/**
 * チャットボットの型定義
 * @file チャットボットで使用する型定義を管理するファイル
 */

/**
 * 質問の種類を定義する列挙型
 */
export const QuestionType = {
  SELECT: "select",
  TEXT: "text",
  PERCENTAGE: "percentage",
  HYBRID: "hybrid",
  ADDRESS: "address",
} as const;

export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];

/**
 * 選択肢の型定義
 */
export interface Option {
  /** 選択肢の値 */
  value: string;
  /** 選択肢のラベル */
  label: string;
}

/**
 * 質問の型定義
 */
export interface Question {
  /** 質問のID */
  id: string;
  /** 質問文 */
  text: string;
  /** 質問の種類 */
  type: QuestionType;
  /** 選択肢（選択式の場合のみ） */
  options?: Option[];
  /** 補足説明 */
  description?: string;
}

/**
 * チャットメッセージの型定義
 */
export interface ChatMessage {
  /** メッセージのID */
  id: string;
  /** メッセージの送信者（'bot' or 'user'） */
  sender: "bot" | "user";
  /** メッセージの内容 */
  content: string;
  /** 質問データ（ボットからの質問の場合） */
  question?: Question;
  /** 回答データ（ユーザーからの回答の場合） */
  answer?: string | string[];
}

/**
 * チャットの状態を管理する型定義
 */
export interface ChatState {
  /** メッセージの履歴 */
  messages: ChatMessage[];
  /** 現在の質問のインデックス */
  currentQuestionIndex: number;
  /** 回答データ */
  answers: Record<string, string | string[]>;
  /** エラー状態 */
  error?: string;
}
