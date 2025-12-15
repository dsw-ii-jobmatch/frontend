import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home.tsx";
import { supabase } from "./lib/supabaseClient";
import { useEffect, useState } from "react";
import Registro from "./pages/login/Registro.tsx";
import HomeEmpresa from "./pages/home/HomeEmpresa.tsx";



const App = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
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
            element={session ? <Home /> : <Navigate to="/" />}
          />
          <Route path="/registro" element={<Registro />} />
          <Route path="/homeEmpresa" element={<HomeEmpresa />} />
        </Routes>
    </BrowserRouter>
  );
};

export default App;
