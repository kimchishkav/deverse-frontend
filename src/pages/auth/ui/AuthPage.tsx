import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { login, register } from "@/features/auth-by-email";
import { AppRoutes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";

import { getUserById } from "@/entities/user";

import styles from "./AuthPage.module.css";

type AuthMode = "login" | "register";

type LoginFormState = {
  email: string;
  password: string;
};

type RegisterFormState = {
  name: string;
  surname: string;
  username: string;
  profession: string;
  email: string;
  password: string;
};

const initialLoginForm: LoginFormState = {
  email: "",
  password: "",
};

const initialRegisterForm: RegisterFormState = {
  name: "",
  surname: "",
  username: "",
  profession: "",
  email: "",
  password: "",
};

export const AuthPage = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState<AuthMode>("login");
  const [loginForm, setLoginForm] = useState<LoginFormState>(initialLoginForm);
  const [registerForm, setRegisterForm] =
    useState<RegisterFormState>(initialRegisterForm);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isLoginMode = mode === "login";

  const handleLoginChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setLoginForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleRegisterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setRegisterForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const saveAuthData = async (token: string, user: { id: number }) => {
    localStorage.setItem("token", token);

    const fullUser = await getUserById(user.id);

    localStorage.setItem("user", JSON.stringify(fullUser));
  };

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await login(loginForm);

      await saveAuthData(response.token, response.user);
      navigate(AppRoutes.FEED);
    } catch (requestError) {
      console.error("Login error:", requestError);
      setError("Не удалось войти. Проверь email и пароль.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await register(registerForm);

      await saveAuthData(response.token, response.user);
      navigate(AppRoutes.FEED);
    } catch (requestError) {
      console.error("Register error:", requestError);
      setError("Не удалось зарегистрироваться. Проверь данные.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.logo}>Deverse</h1>

          <div className={styles.tabs}>
            <button
              type="button"
              className={isLoginMode ? styles.activeTab : styles.tab}
              onClick={() => setMode("login")}
            >
              Log in
            </button>

            <button
              type="button"
              className={!isLoginMode ? styles.activeTab : styles.tab}
              onClick={() => setMode("register")}
            >
              Sign up
            </button>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.infoBlock}>
            <p className={styles.subtitle}>Code. Connect. Create.</p>
            <h2 className={styles.title}>
              Meet developers.
              <br />
              Exchange knowledge.
              <br />
              Build the future.
            </h2>
          </div>

          {isLoginMode ? (
            <form className={styles.form} onSubmit={handleLoginSubmit}>
              <input
                className={styles.input}
                type="email"
                name="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                placeholder="Your e-mail"
                required
              />

              <input
                className={styles.input}
                type="password"
                name="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                placeholder="Password"
                required
              />

              {error && <p className={styles.error}>{error}</p>}

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Loading..." : "Log in"}
              </Button>
            </form>
          ) : (
            <form className={styles.form} onSubmit={handleRegisterSubmit}>
              <input
                className={styles.input}
                name="name"
                value={registerForm.name}
                onChange={handleRegisterChange}
                placeholder="Your name"
                required
              />

              <input
                className={styles.input}
                name="surname"
                value={registerForm.surname}
                onChange={handleRegisterChange}
                placeholder="Your surname"
                required
              />

              <input
                className={styles.input}
                name="username"
                value={registerForm.username}
                onChange={handleRegisterChange}
                placeholder="Username"
                required
              />

              <input
                className={styles.input}
                name="profession"
                value={registerForm.profession}
                onChange={handleRegisterChange}
                placeholder="Your profession"
                required
              />

              <input
                className={styles.input}
                type="email"
                name="email"
                value={registerForm.email}
                onChange={handleRegisterChange}
                placeholder="Your e-mail"
                required
              />

              <input
                className={styles.input}
                type="password"
                name="password"
                value={registerForm.password}
                onChange={handleRegisterChange}
                placeholder="Password"
                required
              />

              {error && <p className={styles.error}>{error}</p>}

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Loading..." : "Sign up for free"}
              </Button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};
