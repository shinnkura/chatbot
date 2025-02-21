/**
 * チャットボットの質問データ
 * @file チャットボットで使用する質問データを管理するファイル
 */

import { Question, QuestionType } from "../types/chat";

/**
 * チャットボットの質問リスト
 */
export const questions: Question[] = [
  {
    id: "timing",
    text: "転職をお考えの時期を教えていただけますか？",
    type: QuestionType.SELECT,
    options: [
      { value: "immediately", label: "今すぐ" },
      { value: "1month", label: "1ヶ月以内" },
      { value: "3months", label: "3ヶ月以内" },
      { value: "6months", label: "半年以内" },
      { value: "considering", label: "検討中" },
    ],
  },
  {
    id: "current_job",
    text: "現在のご職業を教えていただけますか？",
    type: QuestionType.SELECT,
    options: [
      { value: "nursery", label: "保育士（正社員）" },
      { value: "nursery_part", label: "保育士（非常勤）" },
      { value: "other", label: "他職種" },
      { value: "student", label: "学生" },
      { value: "unemployed", label: "無職" },
    ],
  },
  {
    id: "reason",
    text: "転職をお考えの理由を教えていただけますか？",
    type: QuestionType.HYBRID,
    options: [
      { value: "salary", label: "給与面" },
      { value: "location", label: "通勤の便" },
      { value: "environment", label: "職場環境" },
      { value: "career", label: "キャリアアップ" },
      { value: "other", label: "その他" },
    ],
    description: "選択肢から選ぶか、具体的な理由を記入してください",
  },
  {
    id: "commute",
    text: "通勤時間はどのくらいまでお考えですか？",
    type: QuestionType.SELECT,
    options: [
      { value: "30min", label: "30分以内" },
      { value: "45min", label: "45分以内" },
      { value: "60min", label: "1時間以内" },
      { value: "90min", label: "1時間30分以内" },
      { value: "over90min", label: "1時間30分以上でも可" },
    ],
  },
  {
    id: "address",
    text: "お住まいの地域を教えていただけますか？",
    type: QuestionType.ADDRESS,
    description: "以下の項目をご入力ください",
  },
  {
    id: "current_salary",
    text: "現在の年収を教えていただけますか？",
    type: QuestionType.TEXT,
    description: "例：350万円",
  },
  {
    id: "desired_salary",
    text: "ご希望の年収を教えていただけますか？",
    type: QuestionType.TEXT,
    description: "例：400万円",
  },
  {
    id: "education",
    text: "最終学歴を教えていただけますか？",
    type: QuestionType.TEXT,
  },
  {
    id: "preference",
    text: "運営主体の希望をお聞かせください",
    type: QuestionType.PERCENTAGE,
    description: "株式会社運営と社会福祉法人運営の志望度を％で教えてください",
  },
  {
    id: "priority",
    text: "待遇について、重視する項目を教えてください",
    type: QuestionType.SELECT,
    options: [
      { value: "salary", label: "給与" },
      { value: "benefits", label: "福利厚生" },
    ],
  },
  {
    id: "important_points",
    text: "その他、こだわりたいポイントがございましたら教えてください",
    type: QuestionType.TEXT,
    description: "自由にご記入ください",
  },
];
