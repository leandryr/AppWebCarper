import { useState } from "react";
import Tabla from "./Tabla";
import styles from "../styles/Formulario.module.css";

function Formulario({ setRegistros, setTotal }) {
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!celular || !email) {
      alert("Por favor, ingresa un celular y un correo válidos.");
      return;
    }

    console.log("Formulario enviado correctamente:", { celular, email });
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.contactFields}>
        <label>
          Celular:
          <input
            type="text"
            value={celular}
            onChange={(e) => setCelular(e.target.value)}
            className={styles.input}
            placeholder="Ingresa tu número de celular"
            required
          />
        </label>
        <label>
          Correo de Confirmación:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            placeholder="Ingresa tu correo"
            required
          />
        </label>
      </div>

      <Tabla setRegistros={setRegistros} setTotal={setTotal} />

      <button className={styles.submitButton} onClick={handleSubmit}>
        ENVIAR
      </button>
    </div>
  );
}

export default Formulario;
