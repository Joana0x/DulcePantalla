import Link from "next/link";
import Header from "../componentes/Header";

export default function LogInPage() {
  return (
    <>
      <Header showLoginButton={false} />

      <div className="w-full flex justify-center">
        <div className="max-w-xl w-full px-6 py-12 text-center">
          <p className="mt-4 text-sm">
            ¿Aún no tienes cuenta?{" "}
            <Link href="/sign-up" className="underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
