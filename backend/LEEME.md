# Preparar el backend del taller 5

Esta carpeta retoma el backend modular de la guia anterior y el proyecto local usuarios-graphql. Conserva los usuarios, productos, esquema y resolutores originales. Agrega GraphiQL para comprobar la API desde el navegador y mantiene CORS antes del endpoint.

## Iniciar

Con MySQL activo y el archivo .env de tu proyecto anterior en esta carpeta:

```powershell
npm install
node index.js
```

Tambien puedes usar `npm start`. Manten esa terminal abierta y abre http://localhost:4000/graphql. La interfaz GraphiQL descarga sus componentes desde Internet.

## Comprobar usuarios

Pulsa el boton de ejecutar de GraphiQL con esta consulta:

```graphql
query Usuarios {
  usuarios: users {
    id
    nombre: name
    correo: email
  }
}
```

`users` es el nombre real del campo de la API anterior. `usuarios: users` es un alias: devuelve la lista con la etiqueta `usuarios`. Lo mismo ocurre con `nombre: name` y `correo: email`. Tambien sigue funcionando la consulta original `{ users { id name email } }`.

La guia nueva muestra `edad`, pero ese dato no existe en la base anterior. Al continuar con React, adapta sus operaciones al esquema existente: `UserInput`, identificadores `ID!`, `createUser`, `updateUser` y `deleteUser`. No copies las operaciones en espanol de la guia sin ajustarlas.

## CORS y GraphiQL

En src/index.js, `app.use(cors())` aparece antes de `/graphql`; permite que React consulte la API desde otro puerto. `graphql-http` atiende las operaciones y public/graphiql.html proporciona el editor visual. No es necesario mezclar este servidor con `express-graphql` ni con `graphqlHTTP`.

El archivo index.js de la raiz permite ejecutar `node index.js` en taller5-graphql. La implementacion del servidor permanece en src/index.js, como en la guia anterior.

## Base existente

Usa el mismo .env de tu trabajo anterior. Contiene datos privados y esta excluido de Git. El archivo .env.example solo muestra la estructura.

No necesitas ejecutar database.sql otra vez si graphql_db ya existe: ese script original contiene INSERT de ejemplo que pueden repetir correos.

## Evidencia de la guia

Captura la terminal con el mensaje de inicio y GraphiQL con la consulta y una respuesta sin `errors`.

## Referencias de implementacion

- Servidor Express con graphql-http: https://github.com/graphql/graphql-http#with-express
- CORS en Express: https://expressjs.com/en/resources/middleware/cors/
- GraphiQL en el navegador: https://github.com/graphql/graphiql/tree/main/examples/graphiql-cdn
