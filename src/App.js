import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [juegos, setJuegos] = useState([]);
  const [reseñas, setReseñas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [genero, setGenero] = useState("");
  const [horasJugadas, setHorasJugadas] = useState(0);
  const [completado, setCompletado] = useState(false);
  const [puntuacion, setPuntuacion] = useState(0);
  const [imagen, setImagen] = useState("");
  const [reseña, setReseña] = useState("");

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarBiblioteca, setMostrarBiblioteca] = useState(false);
  const [mostrarResenas, setMostrarResenas] = useState(false);
  const [mostrarEstadisticas, setMostrarEstadisticas] = useState(false);

  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  // Cargar juegos desde backend
  const cargarJuegos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/juegos");
      setJuegos(res.data);
    } catch (error) {
      console.log("Error cargando juegos:", error);
    }
  };

  // Cargar reseñas desde backend
  const cargarResenas = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/resenas");
      setReseñas(res.data);
    } catch (error) {
      console.log("Error cargando reseñas:", error);
    }
  };

  useEffect(() => {
    cargarJuegos();
    cargarResenas();
  }, []);

  // Agregar juego y reseña
  const agregarJuego = async (e) => {
    e.preventDefault();
    try {
      const puntuacionFinal = Math.max(0, Math.min(5, puntuacion));
      const nuevoJuego = {
        titulo,
        genero,
        horasJugadas: Number(horasJugadas),
        completado,
        puntuacion: puntuacionFinal,
        imagen,
      };

      const res = await axios.post("http://localhost:5000/api/juegos", nuevoJuego);

      // Guardar reseña en backend si existe
      if (reseña.trim() !== "") {
        await axios.post("http://localhost:5000/api/resenas", {
          juegoId: res.data._id,
          texto: reseña,
        });
      }

      limpiarFormulario();
      cargarJuegos();
      cargarResenas();
    } catch (error) {
      console.log("Error al agregar juego:", error);
    }
  };

  // Seleccionar juego para editar
  const seleccionarJuego = (j) => {
    setEditando(true);
    setIdEditando(j._id);
    setTitulo(j.titulo);
    setGenero(j.genero);
    setHorasJugadas(j.horasJugadas);
    setCompletado(j.completado);
    setPuntuacion(j.puntuacion);
    setImagen(j.imagen);
    setReseña("");
    setMostrarFormulario(true);
    setMostrarBiblioteca(false);
    setMostrarResenas(false);
    setMostrarEstadisticas(false);
  };

  // Actualizar juego
  const actualizarJuego = async (e) => {
    e.preventDefault();
    try {
      const puntuacionFinal = Math.max(0, Math.min(5, puntuacion));
      await axios.put(`http://localhost:5000/api/juegos/${idEditando}`, {
        titulo,
        genero,
        horasJugadas: Number(horasJugadas),
        completado,
        puntuacion: puntuacionFinal,
        imagen,
      });
      limpiarFormulario();
      setEditando(false);
      cargarJuegos();
    } catch (error) {
      console.log("Error al actualizar juego:", error);
    }
  };

  // Eliminar juego y sus reseñas
  const eliminarJuego = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/juegos/${id}`);
      cargarJuegos();
      // Eliminar reseñas asociadas
      const resenasJuego = reseñas.filter((r) => r.juegoId._id === id);
      for (let r of resenasJuego) {
        await axios.delete(`http://localhost:5000/api/resenas/${r._id}`);
      }
      cargarResenas();
    } catch (error) {
      console.log("Error al eliminar juego:", error);
    }
  };

  // Limpiar formulario
  const limpiarFormulario = () => {
    setTitulo("");
    setGenero("");
    setHorasJugadas(0);
    setCompletado(false);
    setPuntuacion(0);
    setImagen("");
    setReseña("");
    setEditando(false);
    setIdEditando(null);
  };

  // Componente estrellas para formulario
  const StarRating = ({ puntuacion, setPuntuacion }) => {
    return (
      <div className="estrellas">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            onClick={() => setPuntuacion(n)}
            style={{
              cursor: "pointer",
              fontSize: "25px",
              color: n <= puntuacion ? "gold" : "gray",
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // Mostrar estrellas en biblioteca
  const mostrarEstrellas = (n) => {
    const valor = Math.max(0, Math.min(5, n));
    return (
      <div className="estrellas">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} style={{ color: i <= valor ? "gold" : "gray", fontSize: "20px" }}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* NAVBAR */}
      <div className="navbar">
        <button
          onClick={() => {
            setMostrarBiblioteca(false);
            setMostrarFormulario(false);
            setMostrarResenas(false);
            setMostrarEstadisticas(false);
          }}
        >
          Inicio
        </button>
        <button
          onClick={() => {
            setMostrarBiblioteca(true);
            setMostrarFormulario(false);
            setMostrarResenas(false);
            setMostrarEstadisticas(false);
          }}
        >
          Biblioteca
        </button>
        <button
          onClick={() => {
            setMostrarFormulario(true);
            setMostrarBiblioteca(false);
            setMostrarResenas(false);
            setMostrarEstadisticas(false);
          }}
        >
          Agregar Juego
        </button>
        <button
          onClick={() => {
            setMostrarResenas(true);
            setMostrarFormulario(false);
            setMostrarBiblioteca(false);
            setMostrarEstadisticas(false);
          }}
        >
          Reseñas
        </button>
        <button
          onClick={() => {
            setMostrarEstadisticas(true);
            setMostrarFormulario(false);
            setMostrarBiblioteca(false);
            setMostrarResenas(false);
          }}
        >
          Estadísticas
        </button>
      </div>

      {/* BIENVENIDA */}
      {!mostrarFormulario && !mostrarBiblioteca && !mostrarResenas && !mostrarEstadisticas && (
        <div className="bienvenida">
          <h1>🎮 Biblioteca de Juegos</h1>
          <p>Bienvenido a tu gestor de juegos. .</p>
          <img src="/bienbenido.jpg" alt="Bienvenida" className="imagen-bienvenida" />
        </div>
      )}

      {/* FORMULARIO */}
      {mostrarFormulario && (
        <div className="container">
          <h1>{editando ? "✏ Editar juego" : "➕ Agregar nuevo juego"}</h1>
          <form className="formulario" onSubmit={editando ? actualizarJuego : agregarJuego}>
            <input
              type="text"
              placeholder="Título del juego"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Género"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Horas jugadas"
              value={horasJugadas}
              onChange={(e) => setHorasJugadas(Number(e.target.value))}
              min={0}
              required
            />
            <label>Puntuación:</label>
            <StarRating puntuacion={puntuacion} setPuntuacion={setPuntuacion} />
            <input
              type="text"
              placeholder="URL de imagen para agregar"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
            />
            <label>
              <input
                type="checkbox"
                checked={completado}
                onChange={(e) => setCompletado(e.target.checked)}
              />
              ¿Completado?
            </label>
            <textarea
              placeholder="Escribe una reseña del juego...."
              value={reseña}
              onChange={(e) => setReseña(e.target.value)}
              rows={3}
            ></textarea>
            <button type="submit">{editando ? "Actualizar juego" : "Agregar juego"}</button>
            {editando && (
              <button
                type="button"
                className="cancelar"
                onClick={() => {
                  limpiarFormulario();
                  setMostrarFormulario(false);
                }}
              >
                Cancelar edición
              </button>
            )}
          </form>
        </div>
      )}

      {/* BIBLIOTECA */}
      {mostrarBiblioteca && (
        <div className="container">
          <h1>🎮 Mi Biblioteca de Juegos</h1>
          <input
            type="text"
            className="buscador"
            placeholder="🔍 Buscar juego..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <div className="lista">
            {juegos
              .filter((j) => j.titulo.toLowerCase().includes(busqueda.toLowerCase()))
              .map((j) => (
                <div className="card" key={j._id}>
                  <h3>{j.titulo}</h3>
                  <p>🎮 Género: {j.genero}</p>
                  <p>⏱ Horas: {j.horasJugadas}</p>
                  <p>⭐ {mostrarEstrellas(j.puntuacion)}</p>
                  <p>✔ Completado: {j.completado ? "Sí" : "No"}</p>
                  {j.imagen && (
                    <img
                      src={j.imagen}
                      alt={j.titulo}
                      onError={(e) => (e.target.src = "default.jpg")}
                      style={{ maxWidth: "200px", height: "auto" }}
                    />
                  )}
                  <div className="botones">
                    <button className="editar" onClick={() => seleccionarJuego(j)}>Editar</button>
                    <button className="eliminar" onClick={() => eliminarJuego(j._id)}>Eliminar</button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* RESEÑAS */}
      {mostrarResenas && (
        <div className="container">
          <h1>📝 Reseñas de Juegos</h1>
          {reseñas.length === 0 ? (
            <p>No hay reseñas aún.</p>
          ) : (
            reseñas.map((r) => (
              <div key={r._id} className="card reseña">
                <h3>{r.juegoId.titulo}</h3>
                <p>{r.texto}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* ESTADÍSTICAS */}
      {mostrarEstadisticas && (
        <div className="container">
          <h1>📊 Mis Estadísticas</h1>
          <p>Total de juegos: {juegos.length}</p>
          <p>Juegos completados: {juegos.filter(j => j.completado).length}</p>
          <p>Horas jugadas: {juegos.reduce((acc, j) => acc + j.horasJugadas, 0)}</p>
          <p>Puntuación promedio: {(juegos.reduce((acc, j) => acc + j.puntuacion, 0) / (juegos.length || 1)).toFixed(1)}</p>
        </div>
      )}
    </div>
  );
}

export default App;
