import { improveGrammar } from "@/features/improve-grammar/api/improveGrammar";
import { rewriteTone } from "@/features/rewrite-tone/api/rewriteTone";
import { useToast } from "@/shared/ui/toast";
import { useState } from "react";

import styles from "./PostCardEditForm.module.css";

const TONES = [
  { value: "formal", label: "Formal" },
  { value: "friendly", label: "Friendly" },
  { value: "short", label: "Short" },
];

type Props = {
  initialContent: string;
  onSave: (content: string) => void;
  onCancel: () => void;
};

export const PostCardEditForm = ({ initialContent, onSave, onCancel }: Props) => {
  const { showToast } = useToast();
  const [content, setContent] = useState(initialContent);
  const [isImproving, setIsImproving] = useState(false);
  const [rewritingTone, setRewritingTone] = useState<string | null>(null);

  const isBusy = isImproving || rewritingTone !== null;

  const handleImprove = async () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    try {
      setIsImproving(true);
      const improved = await improveGrammar(trimmed);
      setContent(improved);
    } catch {
      showToast("Failed to improve. Try again.");
    } finally {
      setIsImproving(false);
    }
  };

  const handleTone = async (tone: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;
    try {
      setRewritingTone(tone);
      const rewritten = await rewriteTone(trimmed, tone);
      setContent(rewritten);
    } catch {
      showToast("Failed to rewrite. Try again.");
    } finally {
      setRewritingTone(null);
    }
  };

  const handleSave = () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    onSave(trimmed);
  };

  return (
    <div className={styles.container}>
      <textarea
        className={styles.textarea}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className={styles.toneRow}>
        <span className={styles.toneLabel}>Tone:</span>
        <div className={styles.toneChips}>
          {TONES.map((t) => (
            <button
              key={t.value}
              type="button"
              className={`${styles.toneChip} ${rewritingTone === t.value ? styles.toneChipActive : ""}`}
              disabled={isBusy || !content.trim()}
              onClick={() => handleTone(t.value)}
            >
              {rewritingTone === t.value ? "..." : t.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.improveButton}
          disabled={isBusy || !content.trim()}
          onClick={handleImprove}
        >
          {isImproving ? "Improving..." : "Improve"}
        </button>

        <button
          type="button"
          className={styles.saveButton}
          disabled={isBusy}
          onClick={handleSave}
        >
          Save
        </button>

        <button
          type="button"
          className={styles.cancelButton}
          disabled={isBusy}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
