"use client";

import Link from "next/link";
import { auth } from "../lib/firebase-client";
import type { User } from "firebase/auth";
import Image from "next/image";

type Props = {
  showLoginButton?: boolean;
  user?: User | null;
};

export default function Header({ showLoginButton = true, user }: Props) {
  return (
    <header className="site-header">
      <nav className="container nav">
        <div className="nav-left">
          <Link href="/" className="brand">DULCE PANTALLA</Link>
        </div>

        <div className="nav-center">
          <ul className="menu-center">
            <li><Link href="/">INICIO</Link></li>
            <li><Link href="/categorias">CATEGORÍAS</Link></li>
          </ul>
        </div>

        <div className="nav-right">
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 font-semibold text-red-950">
                {user.displayName ?? user.email}
                <span>▼</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg hidden group-hover:block">
                <div className="p-2 text-sm text-gray-700">
                  <p><strong>Email:</strong> {user.email}</p>
                  <Image
                    src={user.photoURL || "/img/default-avatar.png"}
                    alt="Foto de perfil"
                    width={40}
                    height={40}
                    className="rounded-full mt-2"
                  />
                </div>
                <button
                  onClick={async () => {
                    await fetch("/api/sessionLogout", { method: "POST" });
                    await auth.signOut();
                    window.location.href = "/";
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-950 hover:bg-gray-100"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          ) : (
            showLoginButton && (
              <Link href="/log-in" className="login-link">INICIAR SESIÓN</Link>
            )
          )}
        </div>
      </nav>
    </header>
  );
}
