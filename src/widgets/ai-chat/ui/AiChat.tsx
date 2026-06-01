import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from "react";
import { askAI } from "@/features/ai-ask/api/askAI";
import styles from "./AiChat.module.css";

type Message = {
  id: number;
  role: "user" | "ai";
  text: string;
};

const SUGGESTIONS = [
  "What is React?",
  "Explain REST API",
  "Git rebase vs merge",
];

export const AiChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "ai",
      text: "Hi! Ask me anything about IT, programming, or your project.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = messagesRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { id: Date.now(), role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const answer = await askAI(trimmed);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "ai", text: answer },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "ai", text: "Something went wrong. Try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.dot} />
        <h2 className={styles.title}>AI Assistant</h2>
      </div>

      <div className={styles.messages} ref={messagesRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={msg.role === "user" ? styles.userBubble : styles.aiBubble}
          >
            {msg.text}
          </div>
        ))}

        {isLoading && (
          <div className={styles.aiBubble}>
            <span className={styles.typing}>
              <span />
              <span />
              <span />
            </span>
          </div>
        )}

      </div>

      <div className={styles.suggestions}>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            className={styles.suggestion}
            onClick={() => sendMessage(s)}
            disabled={isLoading}
          >
            {s}
          </button>
        ))}
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <textarea
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question..."
          rows={2}
          disabled={isLoading}
        />
        <button
          type="submit"
          className={styles.sendButton}
          disabled={isLoading || !input.trim()}
        >
          Send
        </button>
      </form>
    </aside>
  );
};
