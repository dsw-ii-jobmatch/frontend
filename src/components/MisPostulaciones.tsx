import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface Vacante {
  titulo: string;
  ubicacion: string;
}

interface Postulacion {
  id: string;
  estado: string;
  hoja_vida_url: string | null;
  vacantes: Vacante | null;
}

const MisPostulaciones = () => {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostulaciones = async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("postulaciones")
        .select(
          `
          id,
          estado,
          hoja_vida_url,
          vacantes (
            titulo,
            ubicacion
          )
        `
        )
        .eq("empleado_id", userData.user.id)
        .order("fecha_postulacion", { ascending: false })
        .returns<Postulacion[]>();

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setPostulaciones(data ?? []);
      setLoading(false);
    };

    fetchPostulaciones();
  }, []);

  if (loading) {
    return <p className="text-gray-300">Cargando postulaciones...</p>;
  }

  if (postulaciones.length === 0) {
    return (
      <p className="text-gray-400">
        Aún no te has postulado a ninguna vacante
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {postulaciones.map((p) => (
        <div
          key={p.id}
          className="bg-gray-700 p-6 rounded-xl shadow"
        >
          <h3 className="text-lg font-semibold">
            {p.vacantes?.titulo ?? "Vacante no disponible"}
          </h3>

          <p className="text-gray-300 text-sm">
            {p.vacantes?.ubicacion ?? "Ubicación no disponible"}
          </p>

          <span className="text-yellow-400 mt-2 block">
            Estado: {p.estado}
          </span>

          {p.hoja_vida_url && (
            <a
              href={p.hoja_vida_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline mt-3 inline-block"
            >
              Ver hoja de vida
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export default MisPostulaciones;
