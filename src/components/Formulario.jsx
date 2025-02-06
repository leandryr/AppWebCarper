import { useState } from "react";
import Tabla from "./Tabla";
import stylesFormulario from "../styles/Formulario.module.css";
import stylesResumen from "../styles/Resumen.module.css";

function Formulario({ setRegistros, setTotal }) {
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");
  const [total, setTotalAmount] = useState(0);
  const [registros, setRegistrosList] = useState([]);

  const handleSubmit = () => {
    if (!celular || !email) {
      alert("Por favor, ingresa un celular y un correo válidos.");
      return;
    }

    console.log("Formulario enviado correctamente:", { celular, email });
  };

  return (
    <div className={stylesFormulario.formContainer}>
      <div className={stylesFormulario.contactFields}>
        <label>
          Celular:
          <input
            type="text"
            value={celular}
            onChange={(e) => setCelular(e.target.value)}
            className={stylesFormulario.input}
            placeholder="Ingresa tu número de celular"
            required
          />
        </label>
        <label>
          Email de Confirmación:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={stylesFormulario.input}
            placeholder="Ingresa tu Email"
            required
          />
        </label>
      </div>

      <Tabla setRegistros={setRegistrosList} setTotal={setTotalAmount} />

      {/* Resumen se muestra antes del botón ENVIAR */}
      <div className={stylesResumen.resumen}>
        <h2>Resumen del Registro</h2>
        <p>Total de Asistentes: {registros.length}</p>
        <p className={stylesResumen.totalAmount}>Total S/: {total.toFixed(2)}</p>
        <p><strong>IMPORTANTE:</strong><br />
        Para finalizar el registro debes realizar lo siguiente:<br />
        1. Yapear al 9421-06453 o transferir el monto a la cuenta BCP: 193-344-23-002-008, ambos a nombre de Juan D. Shimabukuro.<br />
        2. Enviar por Whatsapp al mismo número un pantallazo del Yape o Transferencia y esperar la confirmación.<br />
        Gracias y nos vemos pronto!
      </p>
      </div>

      <button className={stylesFormulario.submitButton} onClick={handleSubmit}>
        ENVIAR
      </button>
    </div>
  );
}

export default Formulario;