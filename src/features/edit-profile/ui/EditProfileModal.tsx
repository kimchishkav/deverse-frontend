import { useState, type FormEvent } from "react";

import type { UserProfile } from "@/entities/user";
import { updateProfile, type UpdateProfileDto } from "../api/updateProfile";

import styles from "./EditProfileModal.module.css";

type Props = {
  profile: UserProfile;
  onSave: (updated: UserProfile) => void;
  onClose: () => void;
};

export const EditProfileModal = ({ profile, onSave, onClose }: Props) => {
  const [form, setForm] = useState<UpdateProfileDto>({
    name: profile.name ?? "",
    surname: profile.surname ?? "",
    username: profile.username ?? "",
    profession: profile.profession ?? "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const trimmed: UpdateProfileDto = {
      name: form.name?.trim(),
      surname: form.surname?.trim(),
      username: form.username?.trim(),
      profession: form.profession?.trim(),
    };

    if (!trimmed.username) {
      setError("Username is required.");
      return;
    }

    try {
      setIsSaving(true);
      const updated = await updateProfile(trimmed);
      onSave(updated);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Edit profile</h2>
          <button type="button" className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>First name</label>
              <input
                className={styles.input}
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="First name"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Last name</label>
              <input
                className={styles.input}
                name="surname"
                value={form.surname}
                onChange={handleChange}
                placeholder="Last name"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Username</label>
            <div className={styles.inputWithPrefix}>
              <span className={styles.prefix}>@</span>
              <input
                className={`${styles.input} ${styles.inputPrefixed}`}
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="username"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Profession</label>
            <input
              className={styles.input}
              name="profession"
              value={form.profession}
              onChange={handleChange}
              placeholder="e.g. Frontend Developer"
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
