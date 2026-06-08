import { useState, type ReactNode } from "react";

import { Header } from "@/widgets/header";
import { Sidebar } from "@/widgets/sidebar";

import styles from "./MainLayout.module.css";

type Props = {
  children: ReactNode;
};

export const MainLayout = ({ children }: Props) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className={styles.page}>
      <Header onMenuToggle={() => setIsMobileNavOpen(true)} />

      {isMobileNavOpen && (
        <div className={styles.overlay} onClick={() => setIsMobileNavOpen(false)} />
      )}

      <div className={styles.contentWrapper}>
        <Sidebar isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
};
