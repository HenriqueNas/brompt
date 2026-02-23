"use client";

import { C1Chat, ThemeProvider } from "@thesysai/genui-sdk";
import "@crayonai/react-ui/styles/index.css";

export default function Home() {
  return (
    <ThemeProvider mode="dark">
      <C1Chat apiUrl="/api/chat" />
    </ThemeProvider>
  );
}
