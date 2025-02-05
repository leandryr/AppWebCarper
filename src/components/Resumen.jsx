import styles from "../styles/Resumen.module.css";

function Resumen({ total, registros }) {
  return (
    <div className={styles.resumen}>
      <h2>Resumen del Registro</h2>
      <p>Total de Asistentes: {registros.length}</p>
      <p className={styles.totalAmount}>Total S/: {total.toFixed(2)}</p>
      <p>Detalles incluidos:</p>
      <ul>
        <li>Transporte en bus o auto propio</li>
        <li>Comidas seleccionadas</li>
        <li>Actividades programadas</li>
      </ul>
    </div>
  );
}

export default Resumen;
