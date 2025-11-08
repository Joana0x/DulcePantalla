"use client";

import Link from "next/link";
import { FirebaseError } from "firebase/app";
import { useState } from "react";
import Header from "../componentes/Header";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase-client";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const mismatch =
    confirmPassword.length > 0 &&
    password.length > 0 &&
    password !== confirmPassword;

  const [attempted, setAttempted] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAttempted(true);
    setError(null);

    const msg = validate();
    if (msg) {
      setError(msg); 
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("Usuario creado correctamente");
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/email-already-in-use":
            setError("Este correo ya tiene una cuenta");
            break;
          case "auth/invalid-email":
            setError("Correo inválido");
            break;
          case "auth/weak-password":
            setError("La contraseña es demasiado débil");
            break;
          default:
            setError("Error al registrar el usuario");
        }
      } else {
        setError("Error inesperado");
      }
      console.error("Error de registro:", err);
    }
  }

  function validate(): string | null {
    if (password !== confirmPassword) {
      return "Las contraseñas no coinciden";
    }
    if (!termsAccepted) {
      return "Debe aceptar los términos y condiciones";
    }
    return null;
  }

  const signUpWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential) {
          console.warn("No se pudo obtener las credenciales de Google");
          return;
        }
        const token = credential?.accessToken;
        const user = result.user;
        console.log("Uusuario con Google:", user);
        console.log("Token de acceso:", token);
      })
      .catch((error: unknown) => {
        if (error instanceof FirebaseError) {
          if (error.code === "auth/account-exists-with-different-credential") {
            const email = error.customData?.["email"] as string | undefined;
            console.warn("Cuenta existente con diferente proveedor", email);
            return;
          }
        }
        console.error("Error al iniciar sesión con Google", error);
      });
  };

  return (
    <>
      <Header showLoginButton={true} />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-white z-0" /> {/* Fondo  */}
        <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
          <div className="md:grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1
                style={{ color: "var(--text)" }}
                className=" text-4xl md:text-5xl font-extrabold leading-tight"
              >
                Registrate para acceder a todas las recetas de tus peliculas
                favoritas y mucho más.
              </h1>
              <p className="mt-5 text-gray-700 text-lg">
                Lleva tus sabores favoritos al siguiente nivel con nuestras
                recetas
              </p>
              <div className="mt-6 text-xs text-gray-700">
                Registrate gratis. No se requiere tarjeta de crédito.
              </div>
            </div>

            <div
              style={{
                backgroundColor: "var(--brand)",
                borderColor: "var(--brand)",
              }}
              className="rounded-2xl p-6 shadow-[0_10px_30px_rgba(224,97,156,0.25)] backdrop-blur border"
            >
              <header className="mb-6 text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-white mb-3">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-6 h-6 text-red-950"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-5.33 0-8 2.67-8 6v1h16v-1c0-3.33-2.67-6-8-6Z" />
                  </svg>
                </div>
                <h2 className="!text-white text-2xl font-semibold">
                  Crear cuenta
                </h2>
                <p className="!text-white mt-1 text-sm ">
                  Completa los campos para registrarte.
                </p>
              </header>

              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1 block text-md font-medium text-white"
                  >
                    Nombre
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    placeholder="Tu nombre"
                    required
                    className="w-full rounded-xl border border-white bg-white px-3 py-2 text-red-900 outline-none focus:ring-2 focus:ring-red-950"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-md font-medium text-white"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tucorreo@dominio.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    required
                    className="w-full rounded-xl border border-white bg-white px-3 py-2 text-red-900 outline-none focus:ring-2 focus:ring-red-950"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-1 block text-md font-medium text-white"
                  >
                    Contraseña
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="********"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full rounded-xl border border-white bg-white px-3 py-2 text-red-900 outline-none focus:ring-2 focus:ring-red-950"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirm"
                    className="mb-1 block text-md font-medium text-white"
                  >
                    Confirmar contraseña
                  </label>
                  <input
                    id="confirm"
                    name="confirm"
                    type="password"
                    placeholder="********"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full rounded-xl border border-white bg-white px-3 py-2 text-red-900 outline-none focus:ring-2 focus:ring-red-950"
                    aria-invalid={mismatch ? true : undefined}
                    aria-describedby={mismatch ? "confirm-help" : undefined}
                  />
                  {mismatch && (
                    <p id="confirm-help" className="mt-1 text-sm text-white">
                      Las contraseñas no coinciden.
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="inline-flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      className="rounded border-slate-700 bg-slate-900"
                      checked={termsAccepted}
                      onChange={(e) => {
                        setTermsAccepted(e.target.checked);
                      }}
                    />
                    Acepto términos y privacidad
                  </label>
                  <a href="/log-in" className="text-white hover:text-white">
                    ¿Ya tienes cuenta?
                  </a>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="rounded-xl bg-[#f1cece] border border-[6b4343] p-2 text-sm text-[3c0d1c] "
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-amber-50 bg-[#3e2020] hover:bg-pink-950   text-white font-semibold px-4 py-2"
                >
                  Crear cuenta
                </button>
              </form>

              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-white" /> {/* Linea */}
                <span className="text-xs text-white">o</span>
                <div className="h-px flex-1 bg-white" />
              </div>

              <button
                className="w-full rounded-xl border border-amber-50 bg-[#6b4343] hover:bg-pink-950 px-4 py-2 font-medium text-white inline-flex items-center justify-center gap-2"
                aria-label="Continuar con Google"
                type="button"
                onClick={async () => {
                  try {
                    await signUpWithGoogle();
                  } catch {}
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M21.35 11.1h-9.18v2.98h5.27a4.52 4.52 0 0 1-1.95 2.96 6.06 6.06 0 0 1-3.32.96 6.06 6.06 0 0 1-4.28-1.78 6.26 6.26 0 0 1-1.76-4.4 6.25 6.25 0 0 1 1.76-4.4 6.06 6.06 0 0 1 4.28-1.78c1.46 0 2.78.5 3.82 1.33l2.1-2.1A9.3 9.3 0 0 0 12.17 2 9.1 9.1 0 0 0 5.7 4.7 9.25 9.25 0 0 0 3 11.82a9.25 9.25 0 0 0 2.7 7.12A9.1 9.1 0 0 0 12.17 22c2.49 0 4.57-.82 6.08-2.37 1.56-1.56 2.41-3.77 2.41-6.42 0-.68-.05-1.28-.31-2.11Z" />
                </svg>
                Continuar con Google
              </button>

              <p className="mt-6 text-center text-sm text-white">
                ¿Necesitas ayuda?{" "}
                <Link
                  href="/#faq"
                  className="text-white hover:text-white-950 font-medium"
                >
                  FAQ
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-400">
        Hecho con Tailwind · © 2025
      </footer>
    </>
  );
}
