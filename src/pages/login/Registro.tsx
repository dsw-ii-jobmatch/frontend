import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router";

const Registro = () => {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [tipo, setTipo] = useState<"empleado" | "empresa">("empleado");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1️⃣ Crear usuario en Auth
      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (authError) throw authError;

      const user = authData.user;
      if (!user) throw new Error("No se pudo crear el usuario.");

      // 2️⃣ Crear perfil en usuarios
      const { error: insertError } = await supabase
        .from("usuarios")
        .insert({
          user_id: user.id,
          nombre,
          apellido,
          email,
          tipo, // empresa | empleado
          telefono,
          ubicacion,
        });

      if (insertError) throw insertError;

      // 3️⃣ Redirección
      navigate("/");
    } catch (err: any) {
      console.error("Error en registro:", err);
      setError(err.message || "Error registrando usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          Crear cuenta
        </h2>

        <form onSubmit={handleRegistro} className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Nombre"
              className="w-1/2 px-4 py-2 border rounded-lg"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Apellido"
              className="w-1/2 px-4 py-2 border rounded-lg"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
            />
          </div>

          <input
            type="email"
            placeholder="Correo"
            className="w-full px-4 py-2 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full px-4 py-2 border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Teléfono"
            className="w-full px-4 py-2 border rounded-lg"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />

          <input
            type="text"
            placeholder="Ubicación"
            className="w-full px-4 py-2 border rounded-lg"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
          />

          <select
            className="w-full px-4 py-2 border rounded-lg bg-white"
            value={tipo}
            onChange={(e) =>
              setTipo(e.target.value as "empresa" | "empleado")
            }
          >
            <option value="empleado">Empleado</option>
            <option value="empresa">Empresa</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        {error && (
          <p className="text-red-600 text-center mt-4">
            {error}
          </p>
        )}

        <p className="text-center mt-6 text-sm">
          ¿Ya tienes cuenta?{" "}
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Iniciar sesión
          </button>
        </p>
      </div>
    </div>
  );
};

export default Registro;
