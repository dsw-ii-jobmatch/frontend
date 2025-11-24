import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router";

const Registro = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [tipo, setTipo] = useState("empleado"); // rol por defecto
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Crear cuenta en Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      
    });

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    const userId = data.user?.id;

    // Crear perfil en tabla "usuarios"
    const { error: perfilError } = await supabase.from("usuarios").insert({
      user_id: userId,
      nombre,
      apellido,
      email,
      tipo, // empleado o empresa
      telefono,
      ubicacion,
    });

    if (perfilError) {
      setError(perfilError.message);
      return;
    }

    navigate("/home");
  };

  return (
    <div>
      <h2>Registro</h2>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
        />
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="empleado">Empleado</option>
          <option value="empresa">Empresa</option>
        </select>

        <input
          type="text"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
        <input
          type="text"
          placeholder="Ubicación"
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
        />

        <button type="submit">Registrarse</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Registro;
