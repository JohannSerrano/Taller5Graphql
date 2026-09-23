// Permite seguir usando "node index.js" desde la carpeta del taller.
require("./src/index").start().catch(() => {
  process.exitCode = 1;
});
