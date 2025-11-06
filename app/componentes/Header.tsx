"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  showLoginButton?: boolean;
};

export default function Header({ showLoginButton = true }: Props) {
  const router = useRouter();

  return (
    <header className="site-header">
      <nav className="container nav">
        {/* IZQUIERDA */}
        <div className="nav-left">
          <Link href="/" className="brand">
            DULCE PANTALLA
          </Link>
        </div>

        {/* CENTRO */}
        <div className="nav-center">
          <ul className="menu-center">
            <li>
              <Link href="/">INICIO</Link>
            </li>
            <li>
              <Link href="/categorias">CATEGORÍAS</Link>
            </li>
          </ul>
        </div>

        {/* DERECHA */}
        <div className="nav-right">
          {showLoginButton && (
            <Link href="/log-in" className="login-link">
              INICIAR SESIÓN
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
