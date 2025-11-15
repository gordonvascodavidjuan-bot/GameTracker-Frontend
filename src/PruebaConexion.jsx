import { useEffect } from "react";
import axios from "axios";

function PruebaConexion() {
  useEffect(() => {
    axios.get("http://localhost:5000/api/juegos")
      .then(res => {
        console.log("✅ Conexión exitosa con el backend:", res.data);
        alert("✅ Conectado al backend correctamente. Mira la consola (F12).");
      })
      .catch(err => {
        console.error("❌ Error al conectar con el backend:", err.message);
        alert("❌ No se pudo conectar con el backend. Revisa la consola.");
      });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🔗 Probando conexión con el backend...</h1>
    </div>
  );
}

export default PruebaConexion;
