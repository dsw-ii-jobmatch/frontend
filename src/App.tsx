import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Login from "./pages/login/Login";
import HomeEmpleado from "./pages/home/HomeEmpleado";
import HomeEmpresa from "./pages/home/HomeEmpresa";
import Registro from "./pages/registro/Registro";
import { supabase } from "./lib/supabaseClient";
import { useEffect, useState } from "react";

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [perfil, setPerfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar sesión y perfil
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      if (data.session?.user?.id) {
        const { data: perfilData } = await supabase
          .from("usuarios")
          .select("*")
          .eq("user_id", data.session.user.id)
          .single();

        setPerfil(perfilData);
      }

      setLoading(false);
    };

    loadSession();

    // Detectar login/logout
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        if (!newSession) setPerfil(null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <p>Cargando...</p>;

  // 🔥 Redirección automática según el rol
  const RutaHome = () => {
    if (!session) return <Navigate to="/" />;

    if (!perfil) return <p>Cargando perfil...</p>;

    return perfil.tipo === "empleado"
      ? <Navigate to="/home-empleado" />
      : <Navigate to="/home-empresa" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={session ? <RutaHome /> : <Login />}
        />

        {/* Rutas según rol */}
        <Route path="/home-empleado" element={<HomeEmpleado />} />
        <Route path="/home-empresa" element={<HomeEmpresa />} />

        <Route path="/registro" element={<Registro />} />

        {/* Página /home redirige automáticamente según tipo */}
        <Route path="/home" element={<RutaHome />} />
      </Routes>
    </BrowserRouter>
  );
};


export default App;
