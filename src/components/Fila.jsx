import { useState, useEffect } from "react";
import styles from "../styles/Fila.module.css"; // Importa el módulo de estilos para este componente

function Fila({ index, actualizarFila, eliminarFila }) {
  const [datos, setDatos] = useState({
    nombre: "",
    edad: "",
    fecha: "",
    transporte: "",
    cena: false,
    almuerzo: false,
    subtotal: 0,
  });

  const [edadError, setEdadError] = useState(false);

  useEffect(() => {
    calcularSubtotal();
  }, [datos.fecha, datos.transporte, datos.cena, datos.almuerzo]);

  const calcularSubtotal = () => {
    let subtotal = 0;

    if (datos.fecha === "Sab") {
      if (datos.transporte === "Bus") subtotal = 50;
      if (datos.transporte === "Auto") subtotal = 10;
      if (datos.cena) subtotal += 25;
      if (datos.almuerzo) subtotal += 25;
      if (datos.transporte === "Bus" && datos.cena && datos.almuerzo) {
        subtotal = 75;
      }
    }

    if (datos.fecha === "Dom") {
      if (datos.transporte === "Bus") subtotal = 25;
      if (datos.transporte === "Auto") subtotal = 0;
      if (datos.almuerzo && datos.transporte === "Bus") {
        subtotal = 45;
      }
    }

    setDatos((prev) => ({ ...prev, subtotal }));
    actualizarFila(index, { ...datos, subtotal });
  };

  const handleEdadChange = (e) => {
    const edad = parseInt(e.target.value);
    setEdadError(edad > 18);
    setDatos({ ...datos, edad });
  };

  return (
    <tr className={styles.nuevoRegistro}>
      <td>
        <input
          type="text"
          value={datos.nombre}
          className={styles.input}
          onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
          placeholder="Nombre del asistente"
          required
        />
      </td>

      <td>
        <select
          className={styles.select}
          value={datos.edad}
          onChange={handleEdadChange}
        >
          <option value="">Seleccionar Edad</option>
          {[...Array(18).keys()].map((i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        {edadError && (
          <span className={styles.error}>Edad máxima 18 años</span>
        )}
      </td>

      <td>
        <select
          className={styles.select}
          value={datos.fecha}
          onChange={(e) => {
            const fecha = e.target.value;
            setDatos({
              ...datos,
              fecha,
              cena: fecha === "Dom" ? false : datos.cena,
            });
          }}
        >
          <option value="">Seleccionar</option>
          <option value="Sab">Sábado</option>
          <option value="Dom">Domingo</option>
        </select>
      </td>

      <td>
        <select
          className={styles.select}
          value={datos.transporte}
          onChange={(e) => setDatos({ ...datos, transporte: e.target.value })}
        >
          <option value="">Seleccionar</option>
          <option value="Bus">Bus</option>
          <option value="Auto">Auto Propio</option>
        </select>
      </td>

      <td>
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <div className={styles.switch}>
              <input
                type="checkbox"
                checked={datos.cena}
                disabled={datos.fecha === "Dom"}
                onChange={(e) =>
                  setDatos({ ...datos, cena: e.target.checked })
                }
              />
              <span className={styles.slider} />
            </div>
            <span>Cena</span>
          </label>

          <label className={styles.checkboxLabel}>
            <div className={styles.switch}>
              <input
                type="checkbox"
                checked={datos.almuerzo}
                onChange={(e) =>
                  setDatos({ ...datos, almuerzo: e.target.checked })
                }
              />
              <span className={styles.slider} />
            </div>
            <span>Almuerzo</span>
          </label>
        </div>
      </td>

      <td className={styles.subtotal}>S/ {datos.subtotal.toFixed(2)}</td>

      <td>
        <button
          className={styles.deleteButton}
          onClick={eliminarFila}
          aria-label="Eliminar fila"
        >
          ✕
        </button>
      </td>
    </tr>
  );
}

export default Fila;
