import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Props = {
  empresaId?: string | null;
  vacante?: any | null;
  onCreated?: () => void;
};

const Vacante = ({ empresaId, vacante = null, onCreated }: Props) => {
  const editMode = Boolean(vacante?.id);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [salario, setSalario] = useState<string | number>("");
  const [tipoContrato, setTipoContrato] = useState("");
  const [modalidad, setModalidad] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [requisitos, setRequisitos] = useState("");
  const [estado, setEstado] = useState("activa");

  const [loading, setLoading] = useState(false);

  /* ===============================
     CARGAR DATOS EN MODO EDICIÓN
     =============================== */
  useEffect(() => {
    if (editMode && vacante) {
      setTitulo(vacante.titulo ?? "");
      setDescripcion(vacante.descripcion ?? "");
      setSalario(vacante.salario ?? "");
      setTipoContrato(vacante.tipo_contrato ?? "");
      setModalidad(vacante.modalidad ?? "");
      setUbicacion(vacante.ubicacion ?? "");
      setRequisitos(vacante.requisitos ?? "");
      setEstado(vacante.estado ?? "activa");
    }
  }, [editMode, vacante]);

  /* ===============================
     VALIDACIONES
     =============================== */
  const validate = () => {
    if (!editMode && !empresaId)
      return "Solo las empresas pueden crear vacantes";
    if (!titulo.trim()) return "Título requerido";
    if (!descripcion.trim()) return "Descripción requerida";
    if (salario === "" || Number(salario) <= 0) return "Salario inválido";
    if (!ubicacion.trim()) return "Ubicación requerida";
    if (!tipoContrato) return "Tipo de contrato requerido";
    if (!modalidad) return "Modalidad requerida";
    if (!estado) return "Estado requerido";
    return null;
  };

  /* ===============================
     CREAR / EDITAR VACANTE
     =============================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errorMsg = validate();
    if (errorMsg) {
      alert(errorMsg);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        salario: Number(salario),
        tipo_contrato: tipoContrato,
        modalidad,
        ubicacion: ubicacion.trim(),
        requisitos: requisitos.trim(),
        estado,
      };

      if (editMode && vacante?.id) {
        // ✏️ EDITAR
        const { error } = await supabase
          .from("vacantes")
          .update(payload)
          .eq("id", vacante.id);

        if (error) throw error;
      } else {
        // ➕ CREAR
        const { error } = await supabase.from("vacantes").insert([
          {
            ...payload,
            empresa_id: empresaId,
            fecha_publicacion: new Date().toISOString(),
          },
        ]);

        if (error) throw error;
      }

      onCreated && onCreated();
    } catch (err: any) {
      console.error("Error guardando vacante:", err);
      alert(err.message ?? "Error guardando vacante");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     UI
     =============================== */
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-white">
      <h2 className="text-xl font-bold">
        {editMode ? "Editar vacante" : "Crear vacante"}
      </h2>

      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className="p-2 bg-gray-800 rounded"
      />

      <textarea
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        className="p-2 bg-gray-800 rounded"
      />

      <input
        type="number"
        placeholder="Salario"
        value={salario}
        onChange={(e) => setSalario(e.target.value)}
        className="p-2 bg-gray-800 rounded"
      />

      <input
        type="text"
        placeholder="Ubicación"
        value={ubicacion}
        onChange={(e) => setUbicacion(e.target.value)}
        className="p-2 bg-gray-800 rounded"
      />

      <select
        value={tipoContrato}
        onChange={(e) => setTipoContrato(e.target.value)}
        className="p-2 bg-gray-800 rounded"
      >
        <option value="">Tipo de contrato</option>
        <option value="tiempo completo">Tiempo completo</option>
        <option value="medio tiempo">Medio tiempo</option>
        <option value="freelance">Freelance</option>
        <option value="temporal">Temporal</option>
      </select>

      <select
        value={modalidad}
        onChange={(e) => setModalidad(e.target.value)}
        className="p-2 bg-gray-800 rounded"
      >
        <option value="">Modalidad</option>
        <option value="presencial">Presencial</option>
        <option value="remoto">Remoto</option>
        <option value="híbrido">Híbrido</option>
      </select>

      <select
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
        className="p-2 bg-gray-800 rounded"
      >
        <option value="activa">Activa</option>
        <option value="cerrada">Cerrada</option>
      </select>

      <textarea
        placeholder="Requisitos (opcional)"
        value={requisitos}
        onChange={(e) => setRequisitos(e.target.value)}
        className="p-2 bg-gray-800 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-medium disabled:opacity-60"
      >
        {loading
          ? "Guardando..."
          : editMode
          ? "Guardar cambios"
          : "Crear vacante"}
      </button>

      <div className="text-sm text-gray-400">
        empresa_id: {empresaId ?? "sin valor"}
      </div>
    </form>
  );
};

export default Vacante;
