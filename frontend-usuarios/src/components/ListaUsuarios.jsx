import { useMutation, useQuery } from '@apollo/client/react';
import {
  OBTENER_USUARIOS,
  ELIMINAR_USUARIO,
} from '../graphql/operaciones';

export default function ListaUsuarios({ alEditar }) {
  const { loading, error, data } = useQuery(OBTENER_USUARIOS);

  const [eliminarUsuario] = useMutation(ELIMINAR_USUARIO, {
    refetchQueries: [{ query: OBTENER_USUARIOS }],
  });

  if (loading) {
    return <p>Cargando usuarios...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const eliminar = async (id) => {
    const confirmar = window.confirm(
      '¿Desea eliminar este usuario?'
    );

    if (!confirmar) {
      return;
    }

    await eliminarUsuario({
      variables: {
        id: Number(id),
      },
    });
  };

  return (
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
              >
                Editar
              </button>

              <button
                type="button"
                onClick={() => eliminar(usuario.id)}
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}