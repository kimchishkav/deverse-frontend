import type { ReactNode } from "react";

import { Header } from "@/widgets/header";
import { Sidebar } from "@/widgets/sidebar";

import styles from "./MainLayout.module.css";

type Props = {
  children: ReactNode;
};

export const MainLayout = ({ children }: Props) => {
  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.contentWrapper}>
        <Sidebar />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
};
