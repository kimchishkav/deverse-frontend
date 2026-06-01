import { useState, type ChangeEvent, type FormEvent } from "react";

import { Button } from "@/pages/feed/ui/button";
import { Textarea } from "@/pages/feed/ui/textarea";
import { improveGrammar } from "@/features/improve-grammar/api/improveGrammar";
import { rewriteTone } from "@/features/rewrite-tone/api/rewriteTone";

import styles from "./CreatePostForm.module.css";

const TONES = [
  { value: "slangy",   label: "Slangy" },
  { value: "formal",   label: "Formal" },
  { value: "casual",   label: "Casual" },
  { value: "polite",   label: "Polite" },
  { value: "short",    label: "Short" },
];

type Props = {
  onCreate: (content: string) => void;
};

export const CreatePostForm = ({ onCreate }: Props) => {
  const [text, setText] = useState("");
  const [isImproving, setIsImproving] = useState(false);
  const [improveError, setImproveError] = useState<string | null>(null);
  const [rewritingTone, setRewritingTone] = useState<string | null>(null);

  const isBusy = isImproving || rewritingTone !== null;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setImproveError(null);
  };

  const handleImprove = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    try {
      setIsImproving(true);
      setImproveError(null);
      const improved = await improveGrammar(trimmed);
      setText(improved);
    } catch {
      setImproveError("Failed to improve. Try again.");
    } finally {
      setIsImproving(false);
    }
  };

  const handleTone = async (tone: string) => {
    const trimmed = text.trim();
    if (!trimmed || isBusy) return;
    try {
      setRewritingTone(tone);
      setImproveError(null);
      const rewritten = await rewriteTone(trimmed, tone);
      setText(rewritten);
    } catch {
      setImproveError("Failed to rewrite. Try again.");
    } finally {
      setRewritingTone(null);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setText("");
    setImproveError(null);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Share something</h2>

      <Textarea
        value={text}
        onChange={handleChange}
        placeholder="What do you want to talk about?"
        rows={5}
      />

      <div className={styles.toneRow}>
        <span className={styles.toneLabel}>Tone:</span>
        <div className={styles.toneChips}>
          {TONES.map((t) => (
            <button
              key={t.value}
              type="button"
              className={`${styles.toneChip} ${rewritingTone === t.value ? styles.toneChipLoading : ""}`}
              onClick={() => handleTone(t.value)}
              disabled={isBusy || !text.trim()}
            >
              {rewritingTone === t.value ? "..." : t.label}
            </button>
          ))}
        </div>
      </div>

      {improveError && <p className={styles.error}>{improveError}</p>}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.improveButton}
          onClick={handleImprove}
          disabled={isBusy || !text.trim()}
        >
          {isImproving ? "Improving..." : "Improve"}
        </button>

        <Button type="submit" disabled={!text.trim() || isBusy}>
          Publish
        </Button>
      </div>
    </form>
  );
};
