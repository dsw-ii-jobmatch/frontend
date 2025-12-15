import { useEffect, useState } from "react";
import Header from "../../layout/header/Header";
import Vacante from "../vacantes/Vacante";
import CandidatosVacante from "../../components/CandidatosVacante";
import { supabase } from "../../lib/supabaseClient";

const HomeEmpresa = () => {
  const [empresaId, setEmpresaId] = useState<string | null>(null);
  const [vacantes, setVacantes] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState<string | null>(null);
  const [loadingVacantes, setLoadingVacantes] = useState(false);

  // 👉 candidatos
  const [vacanteSeleccionada, setVacanteSeleccionada] = useState<string | null>(null);

  // 👉 editar
  const [vacanteEditar, setVacanteEditar] = useState<any | null>(null);

  /* =========================
     OBTENER USUARIO / EMPRESA
  ==========================*/
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      const userId = data?.user?.id;
      if (!userId) return;

      const { data: usuario } = await supabase
        .from("usuarios")
        .select("user_id, tipo")
        .eq("user_id", userId)
        .single();

      if (!usuario) return;

      setTipoUsuario(usuario.tipo);
      if (usuario.tipo === "empresa") setEmpresaId(usuario.user_id);
    };

    init();
  }, []);

  /* =========================
     CARGAR VACANTES
  ==========================*/
  const fetchVacantes = async () => {
    if (!empresaId) return;

    setLoadingVacantes(true);

    const { data, error } = await supabase
      .from("vacantes")
      .select("*")
      .eq("empresa_id", empresaId)
      .order("fecha_publicacion", { ascending: false });

    if (!error) setVacantes(data ?? []);
    setLoadingVacantes(false);
  };

  useEffect(() => {
    if (empresaId && tipoUsuario === "empresa") fetchVacantes();
  }, [empresaId, tipoUsuario]);

  /* =========================
     ELIMINAR VACANTE
  ==========================*/
  const eliminarVacante = async (vacanteId: string) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar esta vacante?\nSe perderán las postulaciones."
    );
    if (!confirmar) return;

    const { error } = await supabase
      .from("vacantes")
      .delete()
      .eq("id", vacanteId)
      .eq("empresa_id", empresaId);

    if (error) {
      alert("Error al eliminar vacante");
    } else {
      fetchVacantes();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <Header />

      {tipoUsuario && tipoUsuario !== "empresa" ? (
        <div className="bg-red-800 p-6 rounded-xl mt-10 text-center">
          Acceso restringido
        </div>
      ) : (
        <div className="flex flex-col gap-10">

          {/* PANEL */}
          <section className="bg-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold">Panel empresarial</h2>
            <p className="text-gray-400">empresa_id: {empresaId}</p>
          </section>

          {/* ACCIONES */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className="bg-gray-800 p-6 rounded-xl cursor-pointer hover:scale-105 transition"
              onClick={() => {
                setVacanteEditar(null);
                setOpenModal(true);
              }}
            >
              <h3 className="text-xl font-semibold">Publicar nueva vacante</h3>
            </div>

            <div
              className="bg-gray-800 p-6 rounded-xl cursor-pointer hover:scale-105 transition"
              onClick={() => {
                if (vacantes.length === 0) {
                  alert("No tienes vacantes aún");
                  return;
                }
                setVacanteSeleccionada(vacantes[0].id);
              }}
            >
              <h3 className="text-xl font-semibold">Candidatos</h3>
              <p className="text-gray-400 text-sm">
                Ver candidatos de tus vacantes
              </p>
            </div>
          </section>

          {/* VACANTES */}
          <section className="bg-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Vacantes activas</h2>

            {loadingVacantes ? (
              <p>Cargando...</p>
            ) : vacantes.length === 0 ? (
              <p>No tienes vacantes</p>
            ) : (
              <div className="flex flex-col gap-4">
                {vacantes.map((v) => (
                  <div
                    key={v.id}
                    className="bg-gray-700 p-6 rounded-xl flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold text-lg">{v.titulo}</h3>
                      <p className="text-sm text-gray-300">
                        {v.tipo_contrato} · {v.modalidad} · {v.ubicacion}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="bg-yellow-600 px-3 py-2 rounded"
                        onClick={() => {
                          setVacanteEditar(v);
                          setOpenModal(true);
                        }}
                      >
                        Editar
                      </button>

                      <button
                        className="bg-red-600 px-3 py-2 rounded"
                        onClick={() => eliminarVacante(v.id)}
                      >
                        Eliminar
                      </button>

                      <button
                        className="bg-blue-600 px-3 py-2 rounded"
                        onClick={() => setVacanteSeleccionada(v.id)}
                      >
                        Candidatos
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* MODAL CREAR / EDITAR */}
      {openModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-3xl relative">
            <button
              className="absolute top-4 right-4"
              onClick={() => setOpenModal(false)}
            >
              ✕
            </button>

            <Vacante
              empresaId={empresaId ?? undefined}
              vacante={vacanteEditar}   // 👈 IMPORTANTE
              onCreated={() => {
                fetchVacantes();
                setOpenModal(false);
              }}
            />
          </div>
        </div>
      )}

      {/* MODAL CANDIDATOS */}
      {vacanteSeleccionada && (
        <CandidatosVacante
          vacanteId={vacanteSeleccionada}
          onClose={() => setVacanteSeleccionada(null)}
        />
      )}
    </div>
  );
};

export default HomeEmpresa;
