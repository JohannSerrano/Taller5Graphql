const pool = require("../config/db");

// ==========================
// VALIDACIÓN DE USUARIOS
// ==========================

function cleanUser(datos) {
  const nombre = datos.nombre.trim();
  const correo = datos.correo.trim().toLowerCase();
  const edad = Number(datos.edad);

  if (!nombre || !correo) {
    throw new Error("Nombre y correo son obligatorios");
  }

  if (!Number.isInteger(edad) || edad < 1) {
    throw new Error("La edad debe ser un número entero mayor que cero");
  }

  return {
    nombre,
    correo,
    edad,
  };
}

// ==========================
// VALIDACIÓN DE PRODUCTOS
// ==========================

function cleanProduct(input) {
  const name = input.name.trim();
  const description = input.description.trim();
  const price = Number(input.price);
  const stock = Number(input.stock);

  if (!name || !description) {
    throw new Error("Nombre y descripción son obligatorios");
  }

  if (price <= 0) {
    throw new Error("El precio debe ser mayor que cero");
  }

  if (stock < 0) {
    throw new Error("El stock no puede ser negativo");
  }

  return {
    name,
    description,
    price,
    stock,
  };
}

const root = {
  // ==========================
  // USUARIOS
  // ==========================

  usuarios: async () => {
    const [rows] = await pool.execute(
      `SELECT
      id,
      name AS nombre,
      email AS correo,
      age AS edad
    FROM users
    ORDER BY id`,
    );

    return rows;
  },

  usuario: async ({ id }) => {
    const [rows] = await pool.execute(
      `SELECT
      id,
      name AS nombre,
      email AS correo,
      age AS edad
    FROM users
    WHERE id = ?`,
      [id],
    );

    return rows[0] || null;
  },

  crearUsuario: async ({ datos }) => {
    const { nombre, correo, edad } = cleanUser(datos);

    const [result] = await pool.execute(
      `INSERT INTO users (name, email, age)
     VALUES (?, ?, ?)`,
      [nombre, correo, edad],
    );

    return {
      id: result.insertId,
      nombre,
      correo,
      edad,
    };
  },

  actualizarUsuario: async ({ id, datos }) => {
    const { nombre, correo, edad } = cleanUser(datos);

    const [result] = await pool.execute(
      `UPDATE users
     SET name = ?, email = ?, age = ?
     WHERE id = ?`,
      [nombre, correo, edad, id],
    );

    if (!result.affectedRows) {
      throw new Error(`No existe el usuario ${id}`);
    }

    return {
      id,
      nombre,
      correo,
      edad,
    };
  },

  eliminarUsuario: async ({ id }) => {
    const [rows] = await pool.execute(
      `SELECT
      id,
      name AS nombre,
      email AS correo,
      age AS edad
    FROM users
    WHERE id = ?`,
      [id],
    );

    if (!rows.length) {
      throw new Error(`No existe el usuario ${id}`);
    }

    const usuario = rows[0];

    await pool.execute("DELETE FROM users WHERE id = ?", [id]);

    return usuario;
  },
  // ==========================
  // PRODUCTOS
  // ==========================

  products: async () => {
    const [rows] = await pool.execute(
      `SELECT id, name, description, price, stock
             FROM products
             ORDER BY id`,
    );

    return rows;
  },

  product: async ({ id }) => {
    const [rows] = await pool.execute(
      `SELECT id, name, description, price, stock
             FROM products
             WHERE id = ?`,
      [id],
    );

    return rows[0] || null;
  },

  createProduct: async ({ input }) => {
    const { name, description, price, stock } = cleanProduct(input);

    const [result] = await pool.execute(
      `INSERT INTO products
            (name, description, price, stock)
            VALUES (?, ?, ?, ?)`,
      [name, description, price, stock],
    );

    return {
      id: result.insertId,
      name,
      description,
      price,
      stock,
    };
  },

  updateProduct: async ({ id, input }) => {
    const { name, description, price, stock } = cleanProduct(input);

    const [result] = await pool.execute(
      `UPDATE products
             SET name = ?,
                 description = ?,
                 price = ?,
                 stock = ?
             WHERE id = ?`,
      [name, description, price, stock, id],
    );

    if (!result.affectedRows) {
      throw new Error(`No existe el producto ${id}`);
    }

    return {
      id,
      name,
      description,
      price,
      stock,
    };
  },

  deleteProduct: async ({ id }) => {
    const [result] = await pool.execute("DELETE FROM products WHERE id = ?", [
      id,
    ]);

    return result.affectedRows
      ? {
          success: true,
          message: `Producto ${id} eliminado`,
        }
      : {
          success: false,
          message: `No existe el producto ${id}`,
        };
  },
};

module.exports = root;
