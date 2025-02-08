import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/Formulario.module.css";
import stylestable from "../styles/Table.module.css";

// Configuración de la URL de la API desde las variables de entorno
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Formulario({ setRegistros, setTotal }) {
  const [contacto, setContacto] = useState({ celular: "", email: "" });
  const [asistentes, setAsistentes] = useState([]);
  const [total, setTotalLocal] = useState(0);
  const [enviando, setEnviando] = useState(false);

  const agregarAsistente = () => {
    setAsistentes([
      ...asistentes,
      { nombre: "", edad: "", fecha: "", transporte: "", cena: false, almuerzo: false, subtotal: 0, diaSemana: "" },
    ]);
  };

  const actualizarAsistente = (index, campo, valor) => {
    const nuevosAsistentes = [...asistentes];

    if (campo === "edad" && (valor < 0 || valor > 17)) {
      alert("La edad debe ser un número entre 1 y 17.");
      return;
    }

    if (campo === "fecha") {
      if (valor !== "2025-02-22" && valor !== "2025-02-23") {
        setTimeout(() => {
          alert("Solo puedes elegir Sábado 22 de Febrero o Domingo 23 de Febrero de 2025.");
        }, 1500); // Espera 1.5 segundos antes de mostrar la alerta
        return;
      }
      nuevosAsistentes[index].diaSemana = valor === "2025-02-22" ? "Sábado" : "Domingo";
    }
    

    nuevosAsistentes[index][campo] = valor;

    if (["cena", "almuerzo", "transporte", "fecha"].includes(campo)) {
      const subtotal = calcularSubtotal(nuevosAsistentes[index]);
      nuevosAsistentes[index].subtotal = subtotal;
    }

    setAsistentes(nuevosAsistentes);
    calcularTotal(nuevosAsistentes);
  };

  const calcularSubtotal = (asistente) => {
    let baseSubtotal = 0;

    // Base según día y transporte
    if (asistente.diaSemana === "Sábado") {
      baseSubtotal = asistente.transporte === "Bus" ? 30 : 10;
    } else if (asistente.diaSemana === "Domingo") {
      baseSubtotal = asistente.transporte === "Bus" ? 30 : 0;
    }

    // Descuentos por paquetes
    if (
      asistente.diaSemana === "Sábado" &&
      asistente.transporte === "Bus" &&
      asistente.cena &&
      asistente.almuerzo
    ) {
      return 75;
    }

    if (
      asistente.diaSemana === "Sábado" &&
      asistente.transporte === "Propio" &&
      asistente.cena &&
      asistente.almuerzo
    ) {
      return 45;
    }

    if (
      asistente.diaSemana === "Sábado" &&
      asistente.transporte === "Bus" &&
      asistente.cena &&
      !asistente.almuerzo
    ) {
      return 45;
    }

    if (
      asistente.diaSemana === "Domingo" &&
      asistente.transporte === "Bus" &&
      asistente.almuerzo
    ) {
      return 45;
    }

    // Sumar costos adicionales por comida
    if (asistente.diaSemana !== "Domingo" && asistente.cena) baseSubtotal += 25;
    if (asistente.almuerzo) baseSubtotal += 25;

    return baseSubtotal;
  };

  const calcularTotal = (asistentes) => {
    const totalCalculado = asistentes.reduce((sum, asistente) => sum + asistente.subtotal, 0);
    setTotalLocal(totalCalculado);
    setTotal && setTotal(totalCalculado);
  };
  const validarFormulario = () => {
    if (!contacto.celular || !contacto.email) {
      alert("Por favor, completa los datos de contacto.");
      return false;
    }

    for (const asistente of asistentes) {
      if (!asistente.nombre || !asistente.edad || !asistente.fecha || !asistente.transporte) {
        alert("Todos los campos de asistentes son obligatorios.");
        return false;
      }
    }

    return true;
  };

  const enviarFormulario = async () => {
    if (!validarFormulario()) return;

    setEnviando(true);

    try {
      const payload = { contacto, asistentes, total: total };
      const response = await axios.post(`${API_URL}/api/registros`, payload);
      alert("Formulario enviado con éxito"); 
           // 🔹 Reiniciar el formulario después del envío exitoso
      setContacto({ celular: "", email: "" });
      setAsistentes([]);
      setTotalLocal(0);
      setTotal && setTotal(0);
      setRegistros && setRegistros(response.data);
    } catch (error) {
      alert("Error al enviar el formulario");
    } finally {
      setEnviando(false); // 🔹 Asegura que el botón vuelva a estar activo
    }
  };


  return (
    <div className={styles.formSection}>
      <div className={styles.contacto}>
        <label>
          Celular:
          <input
            type="text"
            inputMode="numeric"  // Muestra solo teclado numérico en móviles
            pattern="[0-9]*"      // Restringe solo a números
            placeholder="Ingrese su celular"
            value={contacto.celular}
            onChange={(e) => setContacto({ ...contacto, celular: e.target.value })}
            required
          />
        </label>
        <label>
          Email de Confirmación:
          <input
            type="email"
            placeholder="Ingrese su email"
            value={contacto.email}
            onChange={(e) => setContacto({ ...contacto, email: e.target.value })}
            required
          />
        </label>
      </div>

      <table className={stylestable.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Edad</th>
            <th>Fecha</th>
            <th>Transporte</th>
            <th>Seleccionar las Comidas</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {asistentes.map((asistente, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  placeholder="Ingrese el nombre"
                  value={asistente.nombre}
                  onChange={(e) => actualizarAsistente(index, "nombre", e.target.value)}
                  required
                />
              </td>
              <td>
              <label className={styles.ocultarEnGrande}>La edad debe estar entre 1 y 17 años</label>
              <input 
                type="number"
                 inputMode="numeric"
                pattern="[0-9]*"
                 placeholder="Edad (1-17)"
                 min="1"
                  max="17"
                 value={asistente.edad}
                 onChange={(e) => actualizarAsistente(index, "edad", e.target.value)}
                 required 
               />
             </td>

             <td className={styles.dateContainer}>
               <label className={styles.labelMobile}>Fecha Disponible Sábados 22 y Domingo 23</label>
               <input
                 className={styles.date}
                 type="date"
                 value={asistente.fecha}
                 min="2025-02-22"
                 max="2025-02-23"
                 onChange={(e) => actualizarAsistente(index, "fecha", e.target.value)}
                 required
               />
               {asistente.fecha !== "2025-02-22" && asistente.fecha !== "2025-02-23" && (
                 <span className={`${styles.ocultarEnGrande} ${styles.errorMessage}`}>
               ⚠ Solo puedes seleccionar Sábado 22 o Domingo 23 de Febrero.
             </span>
               )}
             </td>

              <td>
                <select
                  value={asistente.transporte}
                  onChange={(e) => actualizarAsistente(index, "transporte", e.target.value)}
                  required
                >
                  <option value="">Selecciona</option>
                  <option value="Propio">Propio</option>
                  <option value="Bus">Bus</option>
                </select>
              </td>
              <td>
               <label className={styles.toggle}>
                 <input
                   type="checkbox"
                   checked={asistente.cena}
                   onChange={(e) => actualizarAsistente(index, "cena", e.target.checked)}
                   disabled={asistente.diaSemana === "Domingo"}
                 />
                 <span className={styles.slider}></span>
                 <span className={styles.label}>Cena</span>
               </label>
               <label className={styles.toggle}>
                 <input
                   type="checkbox"
                   checked={asistente.almuerzo}
                   onChange={(e) => actualizarAsistente(index, "almuerzo", e.target.checked)}
                 />
                 <span className={styles.slider}></span>
                 <span className={styles.label}>Almuerzo</span>
               </label>
             </td>

              <td>S/ {asistente.subtotal}</td>
              <td>
                <button
                  className={styles.btnEliminar}
                  onClick={() => setAsistentes(asistentes.filter((_, i) => i !== index))}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      

      <button className={styles.btnAgregar} onClick={agregarAsistente}>
        + Agregar Asistente
      </button>
      <div className={styles.resumen}>
        <h3>Resumen del Registro</h3>
        <p>Total de Asistentes: {asistentes.length}</p>
        <p>Total S/: {total}</p>
      </div>
    
      
      <div className={styles.importante}>
        <strong>IMPORTANTE:</strong>
        <p>
          Para finalizar el registro debes realizar lo siguiente:
          <br />1. Yapea al 9421-06453 o transfiere el monto a la cuenta BCP:
          193-344-23-002-008, ambos a nombre de Juan D. Shimabukuro.
          <br />2. Enviar por Whatsapp al mismo número un pantallazo del Yape o Transferencia y esperar
          la confirmación.
        </p>
      </div>

             <button className={styles.btnEnviar} onClick={enviarFormulario} disabled={enviando}>
               {enviando ? "Enviando..." : "ENVIAR"}
             </button>


    </div>
  );
}

export default Formulario;
