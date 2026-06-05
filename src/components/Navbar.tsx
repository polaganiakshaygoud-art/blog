"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import styles from "./Navbar.module.css";

export const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          Blog<span className={styles.logoAccent}>Hub</span>
        </Link>
        <div className={styles.navLinks}>
          {session ? (
            <>
              <Link href="/create" className="btn-primary">
                Write a Post
              </Link>
              <button onClick={() => signOut()} className="btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary">
                Login
              </Link>
              <Link href="/register" className="btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
