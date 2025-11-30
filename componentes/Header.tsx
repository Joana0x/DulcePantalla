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
        {/* IZQUIERDA */}
        <div className="nav-left">
          <Link
            href={user ? "/dashboard" : "/"}
            className="brand text-red-950 font-bold"
          >
            DULCE PANTALLA
          </Link>
        </div>

        {/* CENTRO */}
        <div className="nav-center">
          <ul className="menu-center flex gap-6">
            <li>
              <Link
                href={user ? "/dashboard" : "/"}
                className="text-red-950 font-semibold login-link"
              >
                INICIO
              </Link>
            </li>

            {/* CATEGORÍAS */}
            <li className="relative group">
              <button className="font-semibold text-white hover:opacity-100 cursor-pointer">
                CATEGORÍAS
              </button>

              {/* DROPDOWN CON CLASE NUEVA */}
              <ul
                className="
                header-categories-dropdown
                absolute left-0 mt-2 w-56 bg-rose-50 border border-rose-300 rounded-lg shadow-lg
                opacity-0 invisible 
                group-hover:opacity-100 group-hover:visible 
                transform scale-95 group-hover:scale-100 
                transition-all duration-300 z-20
              "
              >
                {[
                  "Disney",
                  "Pixar",
                  "Studio Ghibli",
                  "DreamWorks",
                  "Nickelodeon",
                  "Netflix",
                ].map((studio) => (
                  <li
                    key={studio}
                    className="border-b border-rose-200 last:border-none"
                  >
                    <Link
                      href={`/categorias/${studio
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="block px-4 py-2 text-lg font-bold transition-colors duration-200"
                    >
                      {studio}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>

        {/* DERECHA */}
        <div className="nav-right">
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 font-semibold text-white cursor-pointer">
                {user.displayName ?? user.email} <span>▼</span>
              </button>

              {/* Dropdown usuario */}
              <div className="absolute right-0 mt-2 w-64 bg-white border border-rose-300 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                {/* Bloque superior con avatar */}
                <div className="flex items-center gap-3 p-4 border-b border-rose-200">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt="Foto de perfil"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5.121 17.804A9.004 9.004 0 0112 15c2.21 0 4.21.802 5.879 2.121M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  )}
                  <span className="text-base font-medium text-gray-800 truncate max-w-[160px]">
                    {user.email}
                  </span>
                </div>

                {/* Botón cerrar sesión */}
                <button
                  onClick={async () => {
                    await fetch("/api/sessionLogout", { method: "POST" });
                    await auth.signOut();
                    window.location.href = "/";
                  }}
                  className="w-full text-left px-4 py-3 text-base font-bold text-red-900 hover:bg-rose-50 rounded-b-lg cursor-pointer"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          ) : (
            showLoginButton && (
              <Link
                href="/log-in"
                className="login-link cursor-pointer text-red-950 font-semibold"
              >
                INICIAR SESIÓN
              </Link>
            )
          )}
        </div>
      </nav>
    </header>
  );
}
