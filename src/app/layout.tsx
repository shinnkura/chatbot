/**
 * ルートレイアウトコンポーネント
 * @file アプリケーションのルートレイアウト
 */

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "保育士転職相談 | チャットボット",
  description: "保育士様の転職相談に対応するチャットボットです。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
