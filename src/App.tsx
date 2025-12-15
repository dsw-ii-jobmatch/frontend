import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Login from "./pages/login/Login";
import HomeEmpresa from "./pages/home/HomeEmpresa";
import Registro from "./pages/registro/Registro";
import { supabase } from "./lib/supabaseClient";
import { useEffect, useState } from "react";

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar sesión
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      setLoading(false);
    };

    loadSession();

    // Detectar login/logout
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <p>Cargando...</p>;

  return (
    <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={session ? <Navigate to="/home" /> : <Login />}
          />
          <Route
            path="/home"
            element={session ? <HomeEmpresa /> : <Navigate to="/" />}
          />
          <Route path="/registro" element={<Registro />} />
          <Route path="/homeEmpresa" element={<HomeEmpresa />} />
        </Routes>
    </BrowserRouter>
  );
};


export default App;
