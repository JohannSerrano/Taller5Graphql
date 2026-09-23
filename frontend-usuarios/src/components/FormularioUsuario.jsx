import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client/react";

import {
  CREAR_USUARIO,
  ACTUALIZAR_USUARIO,
  OBTENER_USUARIOS,
} from "../graphql/operaciones";

const inicial = {
  nombre: "",
  correo: "",
  edad: "",
};

export default function FormularioUsuario({ usuarioEditar, alTerminar }) {
  const [formulario, setFormulario] = useState(inicial);
  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  const opciones = {
    refetchQueries: [{ query: OBTENER_USUARIOS }],
    awaitRefetchQueries: true,
  };

  const [crear, { loading: creando }] = useMutation(CREAR_USUARIO, opciones);

  const [actualizar, { loading: actualizando }] = useMutation(
    ACTUALIZAR_USUARIO,
    opciones,
  );

  useEffect(() => {
    setFormulario(
      usuarioEditar
        ? {
            nombre: usuarioEditar.nombre,
            correo: usuarioEditar.correo,
            edad: usuarioEditar.edad,
          }
        : inicial,
    );
  }, [usuarioEditar]);

  const cambiar = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });

    setMensajeExito("");
    setMensajeError("");
  };

  const guardar = async (e) => {
    e.preventDefault();

    setMensajeExito("");
    setMensajeError("");

    const datos = {
      ...formulario,
      edad: Number(formulario.edad),
    };

    try {
      if (usuarioEditar) {
        await actualizar({
          variables: {
            id: Number(usuarioEditar.id),
            datos,
          },
        });

        setMensajeExito("Usuario actualizado correctamente.");
      } else {
        await crear({
          variables: {
            datos,
          },
        });

        setMensajeExito("Usuario registrado correctamente.");
      }

      setFormulario(inicial);
      alTerminar();
    } catch (error) {
      setMensajeError(
        `No fue posible guardar la información: ${error.message}`,
      );
    }
  };

  const procesando = creando || actualizando;

  return (
    <>
      <form onSubmit={guardar}>
        <h2>{usuarioEditar ? "Editar usuario" : "Nuevo usuario"}</h2>

        <input
          name="nombre"
          placeholder="Nombre"
          value={formulario.nombre}
          onChange={cambiar}
          required
          disabled={procesando}
        />

        <input
          name="correo"
          type="email"
          placeholder="Correo"
          value={formulario.correo}
          onChange={cambiar}
          required
          disabled={procesando}
        />

        <input
          name="edad"
          type="number"
          min="1"
          placeholder="Edad"
          value={formulario.edad}
          onChange={cambiar}
          required
          disabled={procesando}
        />

        <button type="submit" disabled={procesando}>
          {procesando
            ? "Guardando..."
            : usuarioEditar
              ? "Actualizar"
              : "Guardar"}
        </button>
      </form>

      {procesando && (
        <p className="mensaje-carga" role="status">
          Procesando información...
        </p>
      )}

      {mensajeExito && (
        <p className="mensaje-exito" role="status">
          ✓ {mensajeExito}
        </p>
      )}

      {mensajeError && (
        <p className="mensaje-error" role="alert">
          ✕ {mensajeError}
        </p>
      )}
    </>
  );
}
