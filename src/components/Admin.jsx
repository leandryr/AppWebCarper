import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import styles from "../styles/Admin.module.css";
import stylessta from "../styles/Estadisticas.module.css";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Admin() {
  // Estados para los registros y estadísticas
  const [registros, setRegistros] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    totalCena: 0,
    totalAlmuerzo: 0,
    transporteBus: 0,
    transportePropio: 0,
    pagosCompletos: 0,
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Estado para autenticación
  const [password, setPassword] = useState("");
  const [accesoPermitido, setAccesoPermitido] = useState(false);

  // Verificar la contraseña
  const verificarPassword = () => {
    if (password === "789789") {
      setAccesoPermitido(true);
    } else {
      alert("Contraseña incorrecta");
      setPassword(""); // Borra el campo si es incorrecto
    }
  };

  // Calcular estadísticas correctamente
  const calcularEstadisticas = useCallback((registros) => {
    const total = registros.reduce((acc, curr) => acc + curr.asistentes.length, 0);
    const totalCena = registros.reduce((acc, curr) => acc + curr.asistentes.filter((a) => a.cena).length, 0);
    const totalAlmuerzo = registros.reduce((acc, curr) => acc + curr.asistentes.filter((a) => a.almuerzo).length, 0);
    const transporteBus = registros.reduce(
      (acc, curr) => acc + curr.asistentes.filter((a) => a.transporte?.toLowerCase() === "bus").length,
      0
    );
    const transportePropio = registros.reduce(
      (acc, curr) => acc + curr.asistentes.filter((a) => a.transporte?.toLowerCase() === "propio").length,
      0
    );
    const pagosCompletos = registros.reduce(
      (acc, curr) => acc + curr.asistentes.filter((a) => a.pagado).length,
      0
    );

    setEstadisticas({
      total,
      totalCena,
      totalAlmuerzo,
      transporteBus,
      transportePropio,
      pagosCompletos,
    });
  }, []);

  // Obtener registros al montar el componente
  useEffect(() => {
    const fetchRegistros = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/registros`);
        setRegistros(response.data);
        setError("");
      } catch (error) {
        setError("Error al cargar registros");
        console.error("Error:", error.message);
      } finally {
        setCargando(false);
      }
    };
    
    fetchRegistros();
  }, []);

  // Actualizar estadísticas cuando cambian los registros
  useEffect(() => {
    calcularEstadisticas(registros);
  }, [registros, calcularEstadisticas]);

  const togglePago = async (registroId, asistenteIndex) => {
    try {
      const updatedRegistros = [...registros];
      const asistente = updatedRegistros.find(r => r._id === registroId).asistentes[asistenteIndex];
      
      // Invertir el estado de pagado
      asistente.pagado = !asistente.pagado;

      // Actualizar en backend
      await axios.put(`${API_URL}/api/registros/${registroId}/pago`, { asistenteIndex });

      setRegistros(updatedRegistros);
    } catch (error) {
      console.error("Error al actualizar pago:", error.message);
      setError("Error al actualizar el estado de pago");
    }
  };

  const exportarExcel = () => {
    const registrosOrdenados = registros.flatMap(registro =>
      registro.asistentes.map(asistente => ({
        Nombre: asistente.nombre,
        Edad: asistente.edad,
        Fecha: asistente.fecha,
        Transporte: asistente.transporte,
        Cena: asistente.cena ? "Sí" : "No",
        Almuerzo: asistente.almuerzo ? "Sí" : "No",
        Subtotal: asistente.subtotal,
        Pago: asistente.pagado ? "Pagado" : "Pendiente",
      }))
    );

    const ws = XLSX.utils.json_to_sheet(registrosOrdenados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registros");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "registros.xlsx");
  };

  if (cargando) return <div className={styles.loading}>Cargando...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.adminSection}>
      {!accesoPermitido ? (
        <div className={styles.login}>
          <h2>Acceso a Administración</h2>
          <input
            type="password"
            placeholder="Ingrese la contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={verificarPassword}>Ingresar</button>
        </div>
      ) : (
        <div>
          <h1>Panel de Administración</h1>

          <div className={stylessta.stats}>
            <h2>Estadísticas</h2>
            <p>Total de asistentes: {estadisticas.total}</p>
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
                registro.asistentes.map((asistente, index) => (
                  <tr key={`${registro._id}-${index}`}>
                    <td>{asistente.nombre}</td>
                    <td>{asistente.edad}</td>
                    <td>{asistente.fecha}</td>
                    <td>{asistente.transporte}</td>
                    <td>{asistente.cena ? "✔️" : "❌"}</td>
                    <td>{asistente.almuerzo ? "✔️" : "❌"}</td>
                    <td>S/ {asistente.subtotal}</td>
                    <td>
                      <button
                        className={`${styles.btnPago} ${asistente.pagado ? styles.pagado : styles.pendiente}`}
                        onClick={() => togglePago(registro._id, index)}
                      >
                        {asistente.pagado ? "Pagado" : "Pendiente"}
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
      )}
    </div>
  );
}

export default Admin;
