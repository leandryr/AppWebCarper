import { useState } from "react";
import Formulario from "./components/Formulario";
import styles from "./styles/App.module.css"; 
import logoCarper from "./assets/logo-carper.png"; 

function App() {
  const [registros, setRegistros] = useState([]);
  const [total, setTotal] = useState(0);

  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <img src={logoCarper} alt="Logo Carper" className={styles.logo} />
        <h1>CARPER - REGISTRO CAMPAMENTO 2025</h1>
      </header>
      <Formulario setRegistros={setRegistros} setTotal={setTotal} />
      <footer className={styles.footer}>
        <p>Propiedad de Carper | Creado por <a href="https://rivasdev.com" target="_blank" rel="noopener noreferrer">RivaDev</a></p>
        <p>2025. Todos los derechos reservados </p>
      </footer>
    </div>
  );
}

export default App;
