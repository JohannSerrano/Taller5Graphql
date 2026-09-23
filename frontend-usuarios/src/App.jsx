import { useState } from 'react';
import FormularioUsuario from './components/FormularioUsuario';
import ListaUsuarios from './components/ListaUsuarios';
import './App.css';

export default function App() {
  const [usuarioEditar, setUsuarioEditar] = useState(null);

  return (
    <main className="contenedor">
      <h1>Gestión de usuarios</h1>

      <FormularioUsuario
        usuarioEditar={usuarioEditar}
        alTerminar={() => setUsuarioEditar(null)}
      />

      <ListaUsuarios
        alEditar={setUsuarioEditar}
      />
    </main>
  );
}