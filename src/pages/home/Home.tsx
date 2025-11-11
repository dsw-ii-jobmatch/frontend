import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div>
      <h2>Bienvenido al Home</h2>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
};

export default Home;
