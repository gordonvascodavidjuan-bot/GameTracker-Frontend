import { useState } from "react";
import axios from "axios";

function FormularioJuego() {
  const [nuevoJuego, setNuevoJuego] = useState({
    titulo: "",
    genero: "",
    horasJugadas: 0,
    completado: false,
    puntuacion: 0
  });

  // Detecta cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNuevoJuego({
      ...nuevoJuego,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Enviar el formulario al backend
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/juegos", nuevoJuego)
      .then(() => {
        alert("🎮 Juego agregado correctamente!");
        setNuevoJuego({
          titulo: "",
          genero: "",
          horasJugadas: 0,
          completado: false,
          puntuacion: 0
        });
      })
      .catch(err => {
        alert("❌ Error al agregar el juego: " + err.message);
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>➕ Agregar Nuevo Juego</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título:</label><br />
          <input
            type="text"
            name="titulo"
            value={nuevoJuego.titulo}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Género:</label><br />
          <input
            type="text"
            name="genero"
            value={nuevoJuego.genero}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Horas Jugadas:</label><br />
          <input
            type="number"
            name="horasJugadas"
            value={nuevoJuego.horasJugadas}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="completado"
              checked={nuevoJuego.completado}
              onChange={handleChange}
            />
            Completado
          </label>
        </div>

        <div>
          <label>Puntuación:</label><br />
          <input
            type="number"
            name="puntuacion"
            value={nuevoJuego.puntuacion}
            onChange={handleChange}
            min="0"
            max="10"
          />
        </div>

        <button type="submit" style={{ marginTop: "10px" }}>Guardar Juego</button>
      </form>
    </div>
  );
}

export default FormularioJuego;
