// app/componentes/Footer.tsx
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* LEGALES */}
        <div className={styles.legales}>
          <h3 className={styles.titulo}>LEGALES</h3>
          <ul>
            <li>
              <a href="#">Aviso de Privacidad</a>
            </li>
            <li>
              <a href="#">Términos y Condiciones</a>
            </li>
          </ul>
        </div>

        {/* SÍGUENOS */}
        <div className={styles.siguenos}>
          <h3 className={styles.titulo}>SÍGUENOS</h3>
          <div className={styles.iconRow}>
            <a href="#" className={styles.iconBox} aria-label="TikTok">
              <FaTiktok />
            </a>
            <a href="#" className={styles.iconBox} aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" className={styles.iconBox} aria-label="Instagram">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Derechos reservados */}
      <div className={styles.reservados}>
        © {new Date().getFullYear()} Dulce Pantalla. Todos los derechos reservados.
      </div>
    </footer>
  );
}
