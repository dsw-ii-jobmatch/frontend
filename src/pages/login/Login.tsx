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

    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError) {
      setError(loginError.message);
      return;
    }

    const user = loginData.user;

    // Trae su rol de la tabla "usuarios"
    const { data: perfil } = await supabase
      .from("usuarios")
      .select("tipo")
      .eq("user_id", user.id)
      .single();

    if (!perfil) {
      setError("No existe perfil, registra uno.");
      return;
    }

    navigate("/home");
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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

        <button type="submit">Iniciar sesión</button>
      </form>

      <button onClick={() => navigate("/registro")}>
        Crear cuenta
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;
