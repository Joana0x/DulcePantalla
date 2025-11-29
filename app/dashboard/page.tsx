"use client";
import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase-client";
import type { User } from "firebase/auth";
import Header from "../../componentes/Header";
import Footer from "../../componentes/Footer";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Header showLoginButton={false} user={user} />
      <main className="container">
        <h1>Bienvenido {user?.displayName ?? user?.email}</h1>
      </main>
      <Footer />
    </>
  );
}
