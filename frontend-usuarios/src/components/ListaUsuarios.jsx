import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";

import { OBTENER_USUARIOS, ELIMINAR_USUARIO } from "../graphql/operaciones";

export default function ListaUsuarios({ alEditar }) {
  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [idEliminando, setIdEliminando] = useState(null);

  const { loading, error, data } = useQuery(OBTENER_USUARIOS);

  const [eliminarUsuario] = useMutation(ELIMINAR_USUARIO, {
    refetchQueries: [{ query: OBTENER_USUARIOS }],
    awaitRefetchQueries: true,
  });

  if (loading) {
    return (
      <p className="mensaje-carga" role="status">
        Cargando usuarios...
      </p>
    );
  }

  if (error) {
    return (
      <p className="mensaje-error" role="alert">
        ✕ No fue posible cargar los usuarios: {error.message}
      </p>
    );
  }

  const eliminar = async (id) => {
    const confirmar = window.confirm("¿Desea eliminar este usuario?");

    if (!confirmar) {
      return;
    }

    setMensajeExito("");
    setMensajeError("");
    setIdEliminando(id);

    try {
      await eliminarUsuario({
        variables: {
          id: Number(id),
        },
      });

      setMensajeExito("Usuario eliminado correctamente.");
    } catch (error) {
      setMensajeError(`No fue posible eliminar el usuario: ${error.message}`);
    } finally {
      setIdEliminando(null);
    }
  };

  return (
    <>
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

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Edad</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {data.usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.correo}</td>
              <td>{usuario.edad}</td>

              <td>
                <button
                  type="button"
                  onClick={() => alEditar(usuario)}
                  disabled={idEliminando !== null}
                >
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => eliminar(usuario.id)}
                  disabled={idEliminando !== null}
                >
                  {idEliminando === usuario.id ? "Eliminando..." : "Eliminar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
