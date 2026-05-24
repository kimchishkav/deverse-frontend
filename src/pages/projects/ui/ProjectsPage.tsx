import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

import {
  createProject,
  getUserProjects,
  type Project,
} from "@/entities/project";
import { getStoredUser } from "@/shared/lib/auth";
import { MainLayout } from "@/widgets/layout";

import styles from "./ProjectsPage.module.css";

type ProjectForm = {
  title: string;
  description: string;
  url: string;
};

const initialForm: ProjectForm = {
  title: "",
  description: "",
  url: "",
};

export const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<ProjectForm>(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      const currentUser = getStoredUser();

      if (!currentUser) return;

      try {
        setIsLoading(true);

        const userProjects = await getUserProjects(currentUser.id);

        setProjects(userProjects);
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

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleCreateProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = form.title.trim();
    const trimmedDescription = form.description.trim();
    const trimmedUrl = form.url.trim();

    if (!trimmedTitle || !trimmedDescription || !trimmedUrl) {
      alert("Заполни title, description и url.");
      return;
    }

    try {
      setIsCreating(true);

      const createdProject = await createProject({
        title: trimmedTitle,
        description: trimmedDescription,
        url: trimmedUrl,
      });

      setProjects((prevProjects) => [createdProject, ...prevProjects]);
      setForm(initialForm);
    } catch (error) {
      console.error("Create project error:", error);
      alert("Не удалось создать проект.");
    } finally {
      setIsCreating(false);
    }
  };

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

        <form className={styles.form} onSubmit={handleCreateProject}>
          <input
            className={styles.input}
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Project title"
          />

          <textarea
            className={styles.textarea}
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Project description"
          />

          <input
            className={styles.input}
            name="url"
            value={form.url}
            onChange={handleChange}
            placeholder="Project URL"
          />

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
        ) : projects.length === 0 ? (
          <p className={styles.text}>No projects yet.</p>
        ) : (
          <div className={styles.projectList}>
            {projects.map((project) => (
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
              </article>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};
