import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      return;
    }

    const user = authData.user;
    if (!user) {
      setError("No se encontró el usuario.");
      return;
    }

    const { data: userData, error: userError } = await supabase
      .from("usuarios")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (userError || !userData) {
      setError("No se pudo obtener el tipo de usuario.");
      return;
    }

    if (userData.tipo === "empleado") {
      navigate("/home");
    } else if (userData.tipo === "empresa") {
      navigate("/homeEmpresa");
    } else {
      setError("Tipo de usuario no válido.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Correo"
            className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Iniciar sesión
          </button>
        </form>

        {/* Mostrar errores */}
        {error && <p className="text-red-600 text-center mt-4">{error}</p>}

        {/* Botón para registrarse */}
        <p className="text-center mt-6 text-sm">
          ¿No tienes cuenta?{" "}
          <button
            className="text-blue-600 font-semibold hover:underline"
            onClick={() => navigate("/Registro")}
          >
            Crear cuenta
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
