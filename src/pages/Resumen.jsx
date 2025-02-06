import styles from "../styles/Resumen.module.css";

function Resumen({ total, registros }) {
  // Verificamos que el total sea un número antes de usar toFixed
  const totalCalculado = isNaN(total) ? 0 : total; 

  return (
    <div className={styles.resumen}>
      <h2>Resumen del Registro</h2>
      <p><strong>Cantidad de Registrados:</strong> {registros.length}</p>
      <p className={styles.totalAmount}>
        <strong>Monto a Pagar:</strong> S/ {totalCalculado.toFixed(2)}
      </p>
      <p>Detalles incluidos:</p>
      <ul>
        <li>Transporte en bus o auto propio</li>
        <li>Comidas seleccionadas</li>
        <li>Actividades programadas</li>
      </ul>
      <p><strong>IMPORTANTE:</strong><br />
        Para finalizar el registro debes realizar lo siguiente:<br />
        1. Yapear al 9421-06453 o transferir el monto a la cuenta BCP: 193-344-23-002-008, ambos a nombre de Juan D. Shimabukuro.<br />
        2. Enviar por Whatsapp al mismo número un pantallazo del Yape o Transferencia y esperar la confirmación.<br />
        Gracias y nos vemos pronto!
      </p>
    </div>
  );
}

export default Resumen;
