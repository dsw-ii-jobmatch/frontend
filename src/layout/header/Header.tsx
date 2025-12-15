import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router";

const Header = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const cargarUsuario = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;

      const { data: perfil } = await supabase
        .from("usuarios")
        .select("*")
        .eq("user_id", auth.user.id)
        .single();

      setUsuario(perfil);
    };

    cargarUsuario();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="bg-blue-600 text-white px-6 py-4 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold">
        {usuario?.tipo === "empresa" ? "Panel Empresa" : "Panel Empleado"}
      </h1>

      <div className="flex items-center gap-4">
        {/* Mostrar nombre */}
        <div className="text-right">
          <p className="font-semibold">{usuario?.nombre} {usuario?.apellido}</p>
          <p className="text-sm opacity-80 capitalize">{usuario?.tipo}</p>
        </div>

        {/* Icono circular */}
        <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold">
          {usuario?.nombre?.charAt(0)?.toUpperCase()}
        </div>

        {/* Botón logout */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white font-semibold transition"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default Header;
