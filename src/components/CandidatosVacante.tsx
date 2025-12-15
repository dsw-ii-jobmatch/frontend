import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface Props {
    vacanteId: string;
    onClose: () => void;
}

const CandidatosVacante = ({ vacanteId, onClose }: Props) => {
    const [candidatos, setCandidatos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCandidatos = async () => {
            setLoading(true);

            const { data, error } = await supabase
                .from("postulaciones")
                .select(`
    id,
    estado,
    fecha_postulacion,
    hoja_vida_url,
    usuarios:usuarios!postulaciones_empleado_id_fkey (
      nombre,
      apellido,
      email,
      telefono,
      ubicacion
    )
  `)
                .eq("vacante_id", vacanteId)
                .order("fecha_postulacion", { ascending: false });

            if (error) {
                console.error(error);
                setCandidatos([]);
            } else {
                setCandidatos(data ?? []);
            }

            setLoading(false);
        };

        fetchCandidatos();
    }, [vacanteId]);

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-8 rounded-xl w-full max-w-4xl relative">
                <button
                    className="absolute top-4 right-4 text-xl"
                    onClick={onClose}
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold mb-6">Candidatos</h2>

                {loading ? (
                    <p>Cargando...</p>
                ) : candidatos.length === 0 ? (
                    <p>No hay postulaciones</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {candidatos.map((c) => (
                            <div
                                key={c.id}
                                className="bg-gray-800 p-6 rounded-xl flex justify-between"
                            >
                                <div>
                                    <h3 className="font-semibold">
                                        {c.usuarios?.nombre} {c.usuarios?.apellido}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        {c.usuarios?.email}
                                    </p>
                                    <p className="text-sm">
                                        Estado: <b>{c.estado}</b>
                                    </p>
                                </div>

                                {c.hoja_vida_url && (
                                    <a
                                        href={c.hoja_vida_url}
                                        target="_blank"
                                        className="bg-blue-600 px-4 py-2 rounded text-sm"
                                    >
                                        Ver hoja de vida
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CandidatosVacante;

