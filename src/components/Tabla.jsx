import { useState } from "react";
import Fila from "./Fila";
import styles from "../styles/Tabla.module.css"; 

function Tabla({ setTotal }) {
  const [filas, setFilas] = useState([{ id: Date.now() }]);

  const agregarFila = () => {
    setFilas([...filas, { id: Date.now() }]);
  };

  const eliminarFila = (id) => {
    const nuevasFilas = filas.filter((fila) => fila.id !== id);
    setFilas(nuevasFilas);
    actualizarTotal(nuevasFilas);
  };

  const actualizarFila = (index, datos) => {
    const nuevasFilas = [...filas];
    nuevasFilas[index] = { ...nuevasFilas[index], ...datos };
    setFilas(nuevasFilas);
    actualizarTotal(nuevasFilas);
  };

  const actualizarTotal = (filasActualizadas = filas) => {
    const total = filasActualizadas.reduce(
      (sum, fila) => sum + (fila.subtotal || 0),
      0
    );
    setTotal(total);
  };

  return (
    <div className={styles.tableContainer}>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Edad</th>
            <th>Fecha</th>
            <th>Transporte</th>
            <th>Comida</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((fila, index) => (
            <Fila
              key={fila.id}
              index={index}
              actualizarFila={actualizarFila}
              eliminarFila={() => eliminarFila(fila.id)}
            />
          ))}
        </tbody>
      </table>
      <button className={styles.addRowButton} onClick={agregarFila}>
        + Agregar Fila
      </button>
    </div>
  );
}

export default Tabla;
