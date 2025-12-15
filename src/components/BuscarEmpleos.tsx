import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface Vacante {
  id: string;
  titulo: string;
  descripcion: string;
  ubicacion: string;
  modalidad: string;
  salario: number;
}

const BuscarEmpleos = () => {
  const [vacantes, setVacantes] = useState<Vacante[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      setUserId(userData.user?.id || null);

      const { data } = await supabase.from("vacantes").select("*");
      setVacantes(data || []);

      setLoading(false);
    };

    fetchData();
  }, []);

  const subirHojaDeVida = async (): Promise<string | null> => {
    if (!cvFile || !userId) return null;

    const fileExt = cvFile.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("hojas_vida")
      .upload(fileName, cvFile, {
        upsert: false,
      });

    if (error) {
      console.error(error);
      return null;
    }

    const { data } = supabase.storage
      .from("hojas_vida")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const postularse = async (vacanteId: string) => {
    if (!userId) {
      alert("Debes iniciar sesión");
      return;
    }

    if (!cvFile) {
      alert("Debes subir tu hoja de vida");
      return;
    }

    const hojaVidaUrl = await subirHojaDeVida();
    if (!hojaVidaUrl) {
      alert("Error al subir la hoja de vida");
      return;
    }

    const { error } = await supabase.from("postulaciones").insert({
      vacante_id: vacanteId,
      empleado_id: userId,
      hoja_vida_url: hojaVidaUrl,
    });

    if (error) {
      console.error(error);
      alert("Ya estás postulado o ocurrió un error");
    } else {
      alert("Postulación enviada con éxito");
      setCvFile(null);
    }
  };

  if (loading) return <p>Cargando vacantes...</p>;

  return (
    <div className="flex flex-col gap-4">
      {vacantes.map((v) => (
        <div
          key={v.id}
          className="bg-gray-700 p-6 rounded-xl shadow"
        >
          <h3 className="text-lg font-semibold">{v.titulo}</h3>

          <p className="text-gray-300 text-sm">
            {v.ubicacion} • {v.modalidad}
          </p>

          <p className="text-gray-400 mt-2">{v.descripcion}</p>

          <p className="text-green-400 mt-2">
            Salario: ${v.salario}
          </p>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setCvFile(e.target.files?.[0] || null)}
            className="mt-3 text-sm text-gray-300"
          />

          <button
            onClick={() => postularse(v.id)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            Postularme
          </button>
        </div>
      ))}
    </div>
  );
};

export default BuscarEmpleos;

