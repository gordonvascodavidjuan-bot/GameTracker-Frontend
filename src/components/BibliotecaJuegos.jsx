import { useEffect, useState } from "react";
import axios from "axios";

function BibliotecaJuegos() {
  const [juegos, setJuegos] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/juegos")
      .then(res => setJuegos(res.data))
      .catch(err => console.error("❌ Error al obtener juegos:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🎮 Biblioteca de Juegos</h1>

      {juegos.length === 0 ? (
        <p>No hay juegos registrados todavía.</p>
      ) : (
        juegos.map(juego => (
          <div
            key={juego._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{juego.titulo}</h3>
            <p>Género: {juego.genero}</p>
            <p>Horas jugadas: {juego.horasJugadas}</p>
            <p>Puntuación: ⭐ {juego.puntuacion}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default BibliotecaJuegos;
