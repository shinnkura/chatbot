/**
 * チャット入力フォームコンポーネント
 * @file チャットの入力フォームを管理するコンポーネント
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { Question, QuestionType } from "../../types/chat";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

interface ChatInputProps {
  /** 現在の質問 */
  currentQuestion?: Question;
  /** 回答送信時のコールバック */
  onSubmit: (answer: string | string[]) => void;
  /** スキップ時のコールバック */
  onSkip: () => void;
  /** 処理中かどうか */
  disabled?: boolean;
}

interface AddressInput {
  postalCode: string;
  prefecture: string;
  city: string;
  street: string;
  other: string;
}

/**
 * チャット入力フォームコンポーネント
 */
export function ChatInput({ currentQuestion, onSubmit, onSkip, disabled }: ChatInputProps) {
  const [textInput, setTextInput] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [percentageValue, setPercentageValue] = useState(50);
  const [addressInput, setAddressInput] = useState<AddressInput>({
    postalCode: "",
    prefecture: "",
    city: "",
    street: "",
    other: "",
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const postalCodeRef = useRef<HTMLInputElement>(null);

  /**
   * 質問が変更されたときにフォームをリセット
   */
  useEffect(() => {
    setTextInput("");
    setSelectedOption("");
    setPercentageValue(50);
    setAddressInput({
      postalCode: "",
      prefecture: "",
      city: "",
      street: "",
      other: "",
    });

    // テキスト入力フォームにフォーカス
    if (currentQuestion?.type === QuestionType.TEXT && inputRef.current && !disabled) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }

    // 住所入力フォームにフォーカス
    if (currentQuestion?.type === QuestionType.ADDRESS && postalCodeRef.current && !disabled) {
      setTimeout(() => {
        postalCodeRef.current?.focus();
      }, 100);
    }
  }, [currentQuestion, disabled]);

  /**
   * フォーム送信時の処理
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentQuestion || disabled) return;

    let answer: string | string[] = "";

    switch (currentQuestion.type) {
      case QuestionType.TEXT:
        answer = textInput;
        break;
      case QuestionType.SELECT:
        answer = selectedOption;
        break;
      case QuestionType.PERCENTAGE:
        answer = `株式会社: ${percentageValue}%, 社会福祉法人: ${100 - percentageValue}%`;
        break;
      case QuestionType.HYBRID:
        answer = textInput || selectedOption;
        break;
      case QuestionType.ADDRESS:
        answer = [
          `郵便番号: ${addressInput.postalCode}`,
          `都道府県: ${addressInput.prefecture}`,
          `市区町村: ${addressInput.city}`,
          `市区町村以下: ${addressInput.street}`,
          addressInput.other ? `その他: ${addressInput.other}` : "",
        ]
          .filter(Boolean)
          .join("\n");
        break;
    }

    onSubmit(answer);
  };

  if (!currentQuestion) return null;

  const isSubmitDisabled =
    disabled ||
    (currentQuestion.type === QuestionType.TEXT && !textInput.trim()) ||
    (currentQuestion.type === QuestionType.SELECT && !selectedOption) ||
    (currentQuestion.type === QuestionType.HYBRID && !selectedOption && !textInput.trim()) ||
    (currentQuestion.type === QuestionType.ADDRESS &&
      (!addressInput.postalCode.trim() ||
        !addressInput.prefecture.trim() ||
        !addressInput.city.trim() ||
        !addressInput.street.trim()));

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-6">
      <div className="space-y-4">
        {currentQuestion.type === QuestionType.TEXT && (
          <div className="animate-fade-in">
            <Input
              ref={inputRef}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="こちらに入力してください"
              className="w-full bg-white/50 backdrop-blur-sm border-2 focus:border-primary/50"
              disabled={disabled}
            />
          </div>
        )}

        {currentQuestion.type === QuestionType.ADDRESS && (
          <div className="animate-fade-in space-y-4">
            <div>
              <Label htmlFor="postalCode" className="text-sm font-medium mb-1.5 block">
                郵便番号
              </Label>
              <Input
                ref={postalCodeRef}
                id="postalCode"
                value={addressInput.postalCode}
                onChange={(e) => setAddressInput((prev) => ({ ...prev, postalCode: e.target.value }))}
                placeholder="例：123-4567"
                className="w-full bg-white/50 backdrop-blur-sm border-2 focus:border-primary/50"
                disabled={disabled}
              />
            </div>
            <div>
              <Label htmlFor="prefecture" className="text-sm font-medium mb-1.5 block">
                都道府県
              </Label>
              <Input
                id="prefecture"
                value={addressInput.prefecture}
                onChange={(e) => setAddressInput((prev) => ({ ...prev, prefecture: e.target.value }))}
                placeholder="例：東京都"
                className="w-full bg-white/50 backdrop-blur-sm border-2 focus:border-primary/50"
                disabled={disabled}
              />
            </div>
            <div>
              <Label htmlFor="city" className="text-sm font-medium mb-1.5 block">
                市区町村
              </Label>
              <Input
                id="city"
                value={addressInput.city}
                onChange={(e) => setAddressInput((prev) => ({ ...prev, city: e.target.value }))}
                placeholder="例：渋谷区"
                className="w-full bg-white/50 backdrop-blur-sm border-2 focus:border-primary/50"
                disabled={disabled}
              />
            </div>
            <div>
              <Label htmlFor="street" className="text-sm font-medium mb-1.5 block">
                市区町村以下
              </Label>
              <Input
                id="street"
                value={addressInput.street}
                onChange={(e) => setAddressInput((prev) => ({ ...prev, street: e.target.value }))}
                placeholder="例：代々木1-2-3"
                className="w-full bg-white/50 backdrop-blur-sm border-2 focus:border-primary/50"
                disabled={disabled}
              />
            </div>
            <div>
              <Label htmlFor="other" className="text-sm font-medium mb-1.5 block">
                建物名・部屋番号など
              </Label>
              <Input
                id="other"
                value={addressInput.other}
                onChange={(e) => setAddressInput((prev) => ({ ...prev, other: e.target.value }))}
                placeholder="例：○○マンション101"
                className="w-full bg-white/50 backdrop-blur-sm border-2 focus:border-primary/50"
                disabled={disabled}
              />
            </div>
          </div>
        )}

        {(currentQuestion.type === QuestionType.SELECT || currentQuestion.type === QuestionType.HYBRID) &&
          currentQuestion.options && (
            <div className="animate-fade-in">
              <RadioGroup
                value={selectedOption}
                onValueChange={setSelectedOption}
                className="space-y-3"
                disabled={disabled}
              >
                {currentQuestion.options.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-3 rounded-lg border-2 border-transparent p-3 hover:border-primary/20 transition-colors"
                  >
                    <RadioGroupItem value={option.value} id={option.value} className="border-2" />
                    <Label htmlFor={option.value} className="flex-1 cursor-pointer text-base">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

        {currentQuestion.type === QuestionType.HYBRID && (
          <div className="animate-fade-in">
            <Input
              ref={inputRef}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="その他の理由があればこちらに入力してください"
              className="w-full mt-4 bg-white/50 backdrop-blur-sm border-2 focus:border-primary/50"
              disabled={disabled}
            />
          </div>
        )}

        {currentQuestion.type === QuestionType.PERCENTAGE && (
          <div className="animate-fade-in space-y-6">
            <div className="space-y-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border-2">
              <div className="flex justify-between items-center">
                <Label className="text-base">株式会社運営</Label>
                <span className="text-lg font-bold text-primary">{percentageValue}%</span>
              </div>
              <Slider
                value={[percentageValue]}
                onValueChange={(value) => setPercentageValue(value[0])}
                max={100}
                step={1}
                className="py-4"
                disabled={disabled}
              />
              <div className="flex justify-between items-center">
                <Label className="text-base">社会福祉法人運営</Label>
                <span className="text-lg font-bold text-primary">{100 - percentageValue}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end items-center gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onSkip}
          className="px-6 py-5 text-base bg-white/80 hover:bg-secondary/90 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md text-muted-foreground hover:text-foreground"
          disabled={disabled}
        >
          スキップ
        </Button>
        <Button
          type="submit"
          className="px-8 py-5 text-base bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 rounded-xl"
          disabled={isSubmitDisabled}
        >
          回答を送信
        </Button>
      </div>
    </form>
  );
}
