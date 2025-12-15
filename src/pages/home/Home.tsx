import { useState } from "react";
import Header from "../../layout/header/Header";
import BuscarEmpleos from "../../components/BuscarEmpleos";
import MisPostulaciones from "../../components/MisPostulaciones";
const Home = () => {
  const [vista, setVista] = useState<"home" | "buscar" | "postulaciones">("home");

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10 flex flex-col">
      <Header />

      <div className="flex flex-col gap-10">

        {vista === "home" && (
          <>
            <section className="bg-gray-800 rounded-2xl p-10 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">
                Encuentra el trabajo ideal para ti
              </h2>
              <p className="text-gray-300 max-w-2xl">
                Explora vacantes, postúlate y revisa tus aplicaciones.
              </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                onClick={() => setVista("buscar")}
                className="bg-gray-800 p-6 rounded-xl shadow-md hover:scale-[1.03] transition cursor-pointer"
              >
                <h3 className="text-xl font-semibold mb-2">Buscar empleos</h3>
                <p className="text-gray-400 text-sm">
                  Explora las vacantes disponibles.
                </p>
              </div>

              <div
                onClick={() => setVista("postulaciones")}
                className="bg-gray-800 p-6 rounded-xl shadow-md hover:scale-[1.03] transition cursor-pointer"
              >
                <h3 className="text-xl font-semibold mb-2">Mis postulaciones</h3>
                <p className="text-gray-400 text-sm">
                  Revisa el estado de tus aplicaciones.
                </p>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-2">Mi perfil</h3>
                <p className="text-gray-400 text-sm">
                  Próximamente
                </p>
              </div>
            </section>
          </>
        )}

        {vista === "buscar" && (
          <>
            <button
              onClick={() => setVista("home")}
              className="text-blue-400 mb-4"
            >
              ← Volver
            </button>
            <BuscarEmpleos />
          </>
        )}

        {vista === "postulaciones" && (
          <>
            <button
              onClick={() => setVista("home")}
              className="text-blue-400 mb-4"
            >
              ← Volver
            </button>
            <MisPostulaciones />
          </>
        )}

      </div>
    </div>
  );
};

export default Home;
