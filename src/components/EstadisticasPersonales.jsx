import { useEffect, useState } from "react";
import axios from "axios";

function EstadisticasPersonales() {
  const [estadisticas, setEstadisticas] = useState({
    totalJuegos: 0,
    totalHoras: 0,
    promedioPuntuacion: 0
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/juegos")
      .then(res => {
        const juegos = res.data;
        const totalJuegos = juegos.length;
        const totalHoras = juegos.reduce((sum, j) => sum + (j.horasJugadas || 0), 0);
        const promedioPuntuacion = totalJuegos
          ? (juegos.reduce((sum, j) => sum + (j.puntuacion || 0), 0) / totalJuegos).toFixed(1)
          : 0;

        setEstadisticas({ totalJuegos, totalHoras, promedioPuntuacion });
      })
      .catch(err => console.error("❌ Error al obtener estadísticas:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>📊 Estadísticas Personales</h1>
      <p><strong>Total de juegos:</strong> {estadisticas.totalJuegos}</p>
      <p><strong>Horas jugadas:</strong> {estadisticas.totalHoras}</p>
      <p><strong>Promedio de puntuación:</strong> {estadisticas.promedioPuntuacion}</p>
    </div>
  );
}

export default EstadisticasPersonales;
