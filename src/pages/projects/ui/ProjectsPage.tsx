import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";

import {
  applyToProject,
  createProject,
  deleteProject,
  getAllProjects,
  getUserProjects,
  updateProject,
  type Project,
} from "@/entities/project";

import { getStoredUser } from "@/shared/lib/auth";
import { useToast } from "@/shared/ui/toast";
import { MainLayout } from "@/widgets/layout";

import styles from "./ProjectsPage.module.css";

type Tab = "my" | "all";

type ProjectForm = {
  title: string;
  description: string;
  url: string;
};

type FormErrors = Partial<ProjectForm>;

const initialForm: ProjectForm = { title: "", description: "", url: "" };

const getCollabKey = (userId: number) => `collab_projects_${userId}`;

const loadCollabIds = (userId: number): number[] => {
  try {
    return JSON.parse(localStorage.getItem(getCollabKey(userId)) ?? "[]");
  } catch {
    return [];
  }
};

const saveCollabIds = (userId: number, ids: number[]) =>
  localStorage.setItem(getCollabKey(userId), JSON.stringify(ids));

const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data === "string") return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
  }
  return "Произошла ошибка.";
};

const validateForm = (form: ProjectForm): FormErrors => {
  const errors: FormErrors = {};

  if (!form.title.trim()) errors.title = "Введи название проекта";
  if (!form.description.trim()) errors.description = "Введи описание проекта";

  const url = form.url.trim();
  if (!url) {
    errors.url = "Введи URL проекта";
  } else if (!url.startsWith("http://") && !url.startsWith("https://")) {
    errors.url = "URL должен начинаться с http:// или https://";
  } else {
    try {
      new URL(url);
    } catch {
      errors.url = "Введи корректный URL (например: https://github.com/...)";
    }
  }

  return errors;
};

export const ProjectsPage = () => {
  const currentUser = getStoredUser();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<Tab>("my");
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [collabIds, setCollabIds] = useState<number[]>(() =>
    currentUser ? loadCollabIds(currentUser.id) : [],
  );
  const [form, setForm] = useState<ProjectForm>(initialForm);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [applyingId, setApplyingId] = useState<number | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<ProjectForm>(initialForm);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!currentUser) return;

      try {
        setIsLoading(true);

        const [userProjects, all] = await Promise.all([
          getUserProjects(currentUser.id),
          getAllProjects(),
        ]);

        setMyProjects(userProjects);
        setAllProjects(all);
      } catch (error) {
        console.error("Fetch projects error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCreateProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = validateForm(form);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setIsCreating(true);

      const createdProject = await createProject({
        title: form.title.trim(),
        description: form.description.trim(),
        url: form.url.trim(),
      });

      setMyProjects((prev) => [createdProject, ...prev]);
      setForm(initialForm);
      setFormErrors({});
      showToast("Проект успешно создан!", "success");
    } catch (error) {
      console.error("Create project error:", error);
      showToast(`Не удалось создать проект: ${extractErrorMessage(error)}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    if (!confirm("Удалить проект?")) return;

    try {
      await deleteProject(projectId);
      setMyProjects((prev) => prev.filter((p) => p.id !== projectId));
      showToast("Проект удалён.", "success");
    } catch (error) {
      console.error("Delete project error:", error);
      showToast("Не удалось удалить проект.");
    }
  };

  const handleStartEdit = (project: Project) => {
    setEditingProjectId(project.id);
    setEditForm({
      title: project.title,
      description: project.description,
      url: project.url,
    });
  };

  const handleSaveEdit = async (projectId: number) => {
    try {
      const updatedProject = await updateProject({
        projectId,
        title: editForm.title,
        description: editForm.description,
        url: editForm.url,
      });

      setMyProjects((prev) =>
        prev.map((p) => (p.id === projectId ? updatedProject : p)),
      );

      setEditingProjectId(null);
      showToast("Проект обновлён.", "success");
    } catch (error) {
      console.error("Update project error:", error);
      showToast("Не удалось обновить проект.");
    }
  };

  const handleCollab = async (projectId: number) => {
    if (!currentUser) return;

    setApplyingId(projectId);
    let success = false;

    try {
      await applyToProject(projectId);
      success = true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        success = true;
      } else {
        console.error("Apply to project error:", error);
        showToast(`Не удалось подать заявку: ${extractErrorMessage(error)}`);
      }
    } finally {
      setApplyingId(null);
    }

    if (success) {
      const newIds = [...collabIds, projectId];
      setCollabIds(newIds);
      saveCollabIds(currentUser.id, newIds);
      setActiveTab("my");
      showToast("Вы теперь коллаборируете!", "success");
    }
  };

  const handleLeaveCollab = (projectId: number) => {
    if (!currentUser) return;

    const newIds = collabIds.filter((id) => id !== projectId);
    setCollabIds(newIds);
    saveCollabIds(currentUser.id, newIds);
    showToast("Вы вышли из коллаборации.", "warning");
  };

  const myProjectIds = new Set(myProjects.map((p) => p.id));

  const otherProjects = allProjects.filter(
    (p) => !myProjectIds.has(p.id) && p.userId !== currentUser?.id,
  );

  const collaboratingProjects = otherProjects.filter((p) =>
    collabIds.includes(p.id),
  );

  const availableProjects = otherProjects.filter(
    (p) => !collabIds.includes(p.id),
  );

  return (
    <MainLayout>
      <div className={styles.page}>
        <section className={styles.header}>
          <div>
            <h1 className={styles.title}>Projects</h1>
            <p className={styles.subtitle}>
              Create and share your developer projects.
            </p>
          </div>
        </section>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "my" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("my")}
          >
            My Projects
            {(myProjects.length > 0 || collaboratingProjects.length > 0) && (
              <span className={styles.tabBadge}>
                {myProjects.length + collaboratingProjects.length}
              </span>
            )}
          </button>

          <button
            className={`${styles.tab} ${activeTab === "all" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Projects
            {availableProjects.length > 0 && (
              <span className={styles.tabBadge}>{availableProjects.length}</span>
            )}
          </button>
        </div>

        {activeTab === "my" && (
          <div>
            <form className={styles.form} onSubmit={handleCreateProject} noValidate>
              <div className={styles.field}>
                <input
                  className={`${styles.input} ${formErrors.title ? styles.inputError : ""}`}
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Project title"
                />
                {formErrors.title && (
                  <p className={styles.fieldError}>{formErrors.title}</p>
                )}
              </div>

              <div className={styles.field}>
                <textarea
                  className={`${styles.textarea} ${formErrors.description ? styles.inputError : ""}`}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Project description"
                />
                {formErrors.description && (
                  <p className={styles.fieldError}>{formErrors.description}</p>
                )}
              </div>

              <div className={styles.field}>
                <input
                  className={`${styles.input} ${formErrors.url ? styles.inputError : ""}`}
                  name="url"
                  type="url"
                  value={form.url}
                  onChange={handleChange}
                  placeholder="Project URL (https://github.com/...)"
                />
                {formErrors.url && (
                  <p className={styles.fieldError}>{formErrors.url}</p>
                )}
              </div>

              <button
                type="submit"
                className={styles.createButton}
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create project"}
              </button>
            </form>

            {isLoading ? (
              <p className={styles.text}>Loading projects...</p>
            ) : myProjects.length === 0 && collaboratingProjects.length === 0 ? (
              <p className={styles.text}>No projects yet.</p>
            ) : (
              <div className={styles.projectList}>
                {myProjects.map((project) => (
                  <article key={project.id} className={styles.projectCard}>
                    {editingProjectId === project.id ? (
                      <div className={styles.editForm}>
                        <input
                          className={styles.input}
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                        />

                        <textarea
                          className={styles.textarea}
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                        />

                        <input
                          className={styles.input}
                          value={editForm.url}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              url: e.target.value,
                            }))
                          }
                        />

                        <div className={styles.actions}>
                          <button
                            type="button"
                            className={styles.saveButton}
                            onClick={() => handleSaveEdit(project.id)}
                          >
                            Save
                          </button>

                          <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={() => setEditingProjectId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h2 className={styles.projectTitle}>{project.title}</h2>
                        <p className={styles.description}>{project.description}</p>
                        <a
                          className={styles.projectLink}
                          href={project.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open project
                        </a>

                        <div className={styles.actions}>
                          <button
                            type="button"
                            className={styles.editButton}
                            onClick={() => handleStartEdit(project)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className={styles.deleteButton}
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </article>
                ))}

                {collaboratingProjects.map((project) => (
                  <article
                    key={project.id}
                    className={`${styles.projectCard} ${styles.collabCard}`}
                  >
                    <div className={styles.collabBadge}>Collaborating</div>
                    <h2 className={styles.projectTitle}>{project.title}</h2>
                    <p className={styles.description}>{project.description}</p>
                    <a
                      className={styles.projectLink}
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open project
                    </a>

                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.leaveButton}
                        onClick={() => handleLeaveCollab(project.id)}
                      >
                        Leave collab
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "all" && (
          <div>
            {isLoading ? (
              <p className={styles.text}>Loading projects...</p>
            ) : availableProjects.length === 0 ? (
              <p className={styles.text}>No other projects yet.</p>
            ) : (
              <div className={styles.projectList}>
                {availableProjects.map((project) => (
                  <article key={project.id} className={styles.projectCard}>
                    <h2 className={styles.projectTitle}>{project.title}</h2>
                    <p className={styles.description}>{project.description}</p>
                    <a
                      className={styles.projectLink}
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open project
                    </a>

                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.collabButton}
                        disabled={applyingId === project.id}
                        onClick={() => handleCollab(project.id)}
                      >
                        {applyingId === project.id ? "Applying..." : "Collab"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};
