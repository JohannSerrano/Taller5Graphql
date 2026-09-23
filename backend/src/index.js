const path = require("node:path");
require("dotenv").config({ path: path.join(__dirname, "../.env"), quiet: true });
const express = require("express");
const cors = require("cors");
const { createHandler } = require("graphql-http/lib/use/express");
const schema = require("./graphql/schema");
const rootValue = require("./graphql/resolvers");
const pool = require("./config/db");

const app = express();

// Debe ir antes del endpoint para permitir solicitudes desde React.
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "taller5-graphql" });
});

// El navegador muestra GraphiQL; las peticiones API conservan su comportamiento.
app.get("/graphql", (req, res, next) => {
  const acceptsHtml = (req.get("accept") || "").includes("text/html");
  if (acceptsHtml && !req.query.query) {
    return res.sendFile(path.join(__dirname, "../public/graphiql.html"));
  }
  next();
});
app.all("/graphql", createHandler({ schema, rootValue }));

async function start() {
  const port = Number(process.env.PORT || 4000);
  try {
    await pool.query("SELECT 1");
    const server = await new Promise((resolve, reject) => {
      const listener = app.listen(port, () => resolve(listener));
      listener.once("error", reject);
    });
    console.log("Conexion con MySQL correcta.");
    console.log(`GraphiQL y API: http://localhost:${port}/graphql`);
    console.log("CORS habilitado para el frontend.");
    return server;
  } catch (error) {
    if (error.code === "EADDRINUSE") {
      console.error(`El puerto ${port} esta ocupado. Deten el otro backend antes de iniciar este.`);
    } else {
      console.error("No se pudo iniciar la API. Revisa que MySQL este activo y que .env tenga la configuracion correcta.");
      console.error("Codigo:", error.code || "ERROR_DE_INICIO");
    }
    await pool.end();
    throw error;
  }
}

if (require.main === module) {
  start().catch(() => { process.exitCode = 1; });
}

module.exports = { app, start, pool };
