import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";
import Index from "./components/Index";
import Admin from "./components/Admin";
import logoCarper from "./assets/logo-carper.png";
import styles from "./styles/Header.module.css";
import footerStyles from "./styles/Footer.module.css";

function App() {
  const [registros, setRegistros] = useState([]);
  const [total, setTotal] = useState(0);

  return (
    <Router>
      <div>
        <header className={styles.header}>
          <img src={logoCarper} alt="Logo Carper" />
          <div>
            <h1>CARPER - REGISTRO CAMPAMENTO</h1>
            <span>2025</span>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Index />} />  {/* Nuevo Index con mensaje */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/formulario" element={<Navigate to="/" />} />  {/* Bloquea el formulario */}
          <Route path="*" element={<Navigate to="/" />} />  {/* Redirige cualquier otra ruta al Index */}
        </Routes>

        <footer className={footerStyles.footer}>
          <div>
            <p>
              Propiedad de Carper | Desarrollado por{" "}
              <a href="https://rivasdev.com" target="_blank" rel="noopener noreferrer">
                RivasDev
              </a>
            </p>
            <p>2025. Todos los derechos reservados</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
