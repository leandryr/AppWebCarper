import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Admin.module.css";
import stylessta from "../styles/Estadisticas.module.css";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

// Configuración de la URL de la API desde las variables de entorno
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Admin() {
  const [registros, setRegistros] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    totalCena: 0,
    totalAlmuerzo: 0,
    transporteBus: 0,
    transportePropio: 0,
    pagosCompletos: 0,
  });

  useEffect(() => {
    const fetchRegistros = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/registros`);
        setRegistros(response.data);
        calcularEstadisticas(response.data);
      } catch (error) {
        console.error("Error al obtener registros:", error);
      }
    };
    fetchRegistros();
  }, []);

  const calcularEstadisticas = (registros) => {
    const total = registros.length;
    const totalCena = registros.reduce((acc, curr) => acc + curr.asistentes.filter((a) => a.cena).length, 0);
    const totalAlmuerzo = registros.reduce((acc, curr) => acc + curr.asistentes.filter((a) => a.almuerzo).length, 0);
    const transporteBus = registros.reduce(
      (acc, curr) => acc + curr.asistentes.filter((a) => a.transporte === "Bus").length,
      0
    );
    const transportePropio = registros.reduce(
      (acc, curr) => acc + curr.asistentes.filter((a) => a.transporte === "Propio").length,
      0
    );
    const pagosCompletos = registros.filter((r) => r.pagado).length;

    setEstadisticas({ total, totalCena, totalAlmuerzo, transporteBus, transportePropio, pagosCompletos });
  };

  const togglePago = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/api/registros/${id}/pago`);
      setRegistros((prevRegistros) =>
        prevRegistros.map((registro) =>
          registro._id === id ? { ...registro, pagado: response.data.pagado } : registro
        )
      );
    } catch (error) {
      console.error("Error al actualizar pago:", error);
    }
  };

  const exportarExcel = () => {
    const registrosOrdenados = registros.flatMap((registro) =>
      registro.asistentes.map((asistente) => ({
        Nombre: asistente.nombre,
        Edad: asistente.edad,
        Fecha: asistente.fecha,
        Transporte: asistente.transporte,
        Cena: asistente.cena ? "Sí" : "No",
        Almuerzo: asistente.almuerzo ? "Sí" : "No",
        Subtotal: asistente.subtotal,
        Pago: registro.pagado ? "Pagado" : "Pendiente",
      }))
    );

    const ws = XLSX.utils.json_to_sheet(registrosOrdenados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registros");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "registros.xlsx");
  };

  return (
    <div className={styles.adminSection}>
      <h1>Panel de Administración</h1>

      <div className={stylessta.stats}>
        <h2>Estadísticas</h2>
        <p>Total de registros: {estadisticas.total}</p>
        <p>Total cenas: {estadisticas.totalCena}</p>
        <p>Total almuerzos: {estadisticas.totalAlmuerzo}</p>
        <p>Transporte en bus: {estadisticas.transporteBus}</p>
        <p>Transporte propio: {estadisticas.transportePropio}</p>
        <p>Pagos completados: {estadisticas.pagosCompletos}</p>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Edad</th>
            <th>Fecha</th>
            <th>Transporte</th>
            <th>Cena</th>
            <th>Almuerzo</th>
            <th>Subtotal</th>
            <th>Pago</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((registro) =>
            registro.asistentes.map((asistente, i) => (
              <tr key={`${registro._id}-${i}`}>
                <td>{asistente.nombre}</td>
                <td>{asistente.edad}</td>
                <td>{asistente.fecha}</td>
                <td>{asistente.transporte}</td>
                <td>{asistente.cena ? "Sí" : "No"}</td>
                <td>{asistente.almuerzo ? "Sí" : "No"}</td>
                <td>S/ {asistente.subtotal}</td>
                <td>
                  <button
                    className={`${styles.btnPago} ${registro.pagado ? styles.pagado : styles.pendiente}`}
                    onClick={() => togglePago(registro._id)}
                  >
                    {registro.pagado ? "Pagado" : "Pendiente"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <button className={styles.btnExport} onClick={exportarExcel}>
        Exportar a Excel
      </button>
    </div>
  );
}

export default Admin;
