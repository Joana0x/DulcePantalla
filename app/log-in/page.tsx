"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, configureAuthPersistence, provider } from "../../lib/firebase-client";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import Header from "../../componentes/Header";
import Footer from "../../componentes/Footer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const router = useRouter();
  const sp = useSearchParams();
  const redirectTo = sp.get("redirectTo") ?? "/dashboard";

  async function sessionLogin() {
    const user = auth.currentUser;
    const idToken = await user?.getIdToken(true);
    if (!idToken) throw new Error("No idToken");

    const res = await fetch("/api/sessionLogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, remember }),
    });

    if (!res.ok) {
      let msg = "No se pudo crear la sesión";
      try {
        const j = await res.json();
        if (j?.error) msg = j.error;
      } catch {
        // ignore
      }
      throw new Error(msg);
    }
  }

  async function onEmailPass(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await configureAuthPersistence(remember);
      await signInWithEmailAndPassword(auth, email, password);
      await sessionLogin();
      router.push(redirectTo);
      router.refresh();
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErr(e.message);
      } else {
        setErr("Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setErr(null);
    setLoading(true);
    try {
      await configureAuthPersistence(remember);
      await signInWithPopup(auth, provider);
      await sessionLogin();
      router.push(redirectTo);
      router.refresh();
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErr(e.message);
      } else {
        setErr("Error con Google");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header showLoginButton={false} />

      <section className="relative overflow-hidden">
        {/* Fondo blanco para mantener estética del registro */}
        <div className="absolute inset-0 bg-white z-0" />

        <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
          <div className="md:grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Lado izquierdo alineado con la tarjeta */}
            <div className="flex flex-col justify-center h-full">
              <h1
                style={{ color: "var(--text)" }}
                className="text-4xl md:text-5xl font-extrabold leading-tight"
              >
                Inicia sesión para acceder a todas las recetas mágicas
              </h1>
              <p className="mt-5 text-gray-700 text-lg">
                Disfruta tus postres favoritos inspirados en películas y series.
              </p>
            </div>

            {/* Tarjeta de login con estética “cafecito” */}
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
                  Iniciar sesión
                </h2>
                <p className="!text-white mt-1 text-sm">
                  Ingresa tus credenciales para continuar.
                </p>
              </header>

              <form onSubmit={onEmailPass} className="space-y-4">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-md font-medium text-white"
                  >
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Tu correo"
                    required
                    className="w-full rounded-md px-3 py-2 bg-white text-red-950"
                  />
                </div>

                {/* Contraseña */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-1 block text-md font-medium text-white"
                  >
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Tu contraseña"
                      required
                      className="w-full rounded-md px-3 py-2 pr-16 bg-white text-red-950"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white hover:text-gray-200"
                    >
                      {showPass ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                </div>

                {/* Recordarme */}
                <label className="inline-flex items-center gap-2 text-sm text-white">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900"
                  />
                  Recordarme
                </label>

                {/* Error */}
                {err && (
                  <p className="rounded-xl bg-red-500/10 border border-red-500/30 p-2 text-sm text-red-200">
                    {err}
                  </p>
                )}

                {/* Botón principal estilo cafecito */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-red-950 font-semibold py-2 rounded-md border border-red-300 shadow-[0_4px_12px_rgba(224,97,156,0.25)] hover:bg-gray-100 transition"
                >
                  {loading ? "Entrando..." : "Entrar"}
                </button>
              </form>

              {/* Separador */}
              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/40" />
                <span className="text-xs text-white">o</span>
                <div className="h-px flex-1 bg-white/40" />
              </div>

              {/* Google — estilo cafecito */}
              <button
                onClick={onGoogle}
                disabled={loading}
                className="w-full bg-white text-red-950 font-semibold py-2 rounded-md border border-red-300 shadow-[0_4px_12px_rgba(224,97,156,0.25)] hover:bg-gray-100 transition"
              >
                {loading ? "Abriendo Google..." : "Continuar con Google"}
              </button>

              {/* Enlace de registro dentro de la tarjeta */}
              <p className="mt-4 text-center text-sm text-white">
                ¿Aún no tienes cuenta?{" "}
                <Link href="/sign-up" className="underline hover:text-gray-200">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
