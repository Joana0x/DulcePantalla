"use client";

import Link from "next/link";
import { FirebaseError } from "firebase/app";

import { useState } from "react";
//import Header from "../componentes/Header";
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
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/email-already-in-use":
            setError("Email ya registrado");
            break;
          case "auth/invalid-email":
            setError("Email inválido");
            break;
          default:
            setError("Error al registrar el usuario");
        }
      } else {
        setError("Error al registrar el usuario");
      }
      console.error("Sign up error", err);
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
            const email = error.customData?.["email"] as string | undefined; // ✅ sin error de tipo
            console.warn("Cuenta existente con diferente proveedor", email);
            return;
          }
        }
        console.error("Error al iniciar sesión con Google", error);
      });
  };

    return (<>
      {/*<Header showLoginButton={true} />*/}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F296C8]/20 via-[#FCE1EE]/40 to-[#F6BBD8]/30" />
        <div className="max-w-7xl mx-auto px-4 py-20 relative">
          <div className="md:grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Crea tu cuenta y comienza a construir
              </h1>
              <p className="mt-5 text-gray-700 text-lg">
                Registrate para acceder a todas las funcionalidades y llevar tus
                proyectos al siguiente nivel.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/#features"
                  className="inline-flex items-center rounded-xl bg-[#F296C8] hover:bg-[#E0619C] text-[#2D2D2D] font-semibold px-5 py-3 shadow-[0_10px_30px_rgba(224,97,156,0.25)]"
                >
                  Ver características
                </Link>
                <Link
                  href="/#pricing"
                  className="inline-flex items-center rounded-xl bg-[#F6BBD8] hover:bg-[#F296C8] text-[#2D2D2D] font-semibold px-5 py-3"
                >
                  Planes
                </Link>
              </div>
              <div className="mt-6 text-xs text-gray-700">
                Registrate gratis. No se requiere tarjeta de crédito.
              </div>
            </div>

            <div className="bg-white/80 border border-[#E9E7EC] rounded-2xl p-6 shadow-[0_10px_30px_rgba(224,97,156,0.25)] backdrop-blur">
              <header className="mb-6 text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-500/20 mb-3">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-6 h-6 text-shadow-gray-950"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-5.33 0-8 2.67-8 6v1h16v-1c0-3.33-2.67-6-8-6Z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold">Crear cuenta</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Completa los campos para registrarte.
                </p>
              </header>

              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1 block text-sm font-medium text-black"
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
                    className="w-full rounded-xl border border-purple-200 bg-purple-200 px-3 py-2 text-gray-800 outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-sm font-medium text-black"
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
                    className="w-full rounded-xl border border-purple-200 bg-purple-200 px-3 py-2 text-gray-800 outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-1 block text-sm font-medium text-black"
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
                    className="w-full rounded-xl border border-purple-200 bg-purple-200 px-3 py-2 text-gray-800 outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirm"
                    className="mb-1 block text-sm font-medium text-black"
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
                    className="w-full rounded-xl border border-purple-200 bg-purple-200 px-3 py-2 text-gray-800 outline-none focus:ring-2 focus:ring-purple-400"
                    aria-invalid={mismatch ? true : undefined}
                    aria-describedby={mismatch ? "confirm-help" : undefined}
                  />
                  {/* Aviso en vivo si no coinciden */}
                  {mismatch && (
                    <p id="confirm-help" className="mt-1 text-xs text-red-700">
                      Las contraseñas no coinciden.
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="inline-flex items-center gap-2 text-black">
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
                  <a href="/login" className="text-black hover:text-white">
                    ¿Ya tienes cuenta?
                  </a>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="rounded-xl bg-red-500/10 border border-red-500/30 p-2 text-sm text-red-700"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-[#E0619C] hover:bg-red-500/30 text-slate-900 font-semibold px-4 py-2"
                >
                  Crear cuenta
                </button>
              </form>

              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-800" />
                <span className="text-xs text-slate-400">o</span>
                <div className="h-px flex-1 bg-slate-800" />
              </div>

              <button
                className="w-full rounded-xl border border-blue-200 bg-blue-200/40 hover:bg-slate-900/60 px-4 py-2 font-medium text-gray-700 inline-flex items-center justify-center gap-2"
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

              <p className="mt-6 text-center text-sm text-gray-500">
                ¿Necesitas ayuda?{" "}
                <Link
                  href="/#faq"
                  className="text-red-950 hover:text-red-950 font-medium"
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


