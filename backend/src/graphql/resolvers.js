const pool = require("../config/db");

// ==========================
// VALIDACIÓN DE USUARIOS
// ==========================

function cleanUser(input) {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();

  if (!name || !email) {
    throw new Error("Nombre y correo son obligatorios");
  }

  return { name, email };
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

  users: async () => {
    const [rows] = await pool.execute(
      "SELECT id, name, email FROM users ORDER BY id",
    );

    return rows;
  },

  user: async ({ id }) => {
    const [rows] = await pool.execute(
      "SELECT id, name, email FROM users WHERE id = ?",
      [id],
    );

    return rows[0] || null;
  },

  createUser: async ({ input }) => {
    const { name, email } = cleanUser(input);

    const [result] = await pool.execute(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email],
    );

    return {
      id: result.insertId,
      name,
      email,
    };
  },

  updateUser: async ({ id, input }) => {
    const { name, email } = cleanUser(input);

    const [result] = await pool.execute(
      "UPDATE users SET name = ?, email = ? WHERE id = ?",
      [name, email, id],
    );

    if (!result.affectedRows) {
      throw new Error(`No existe el usuario ${id}`);
    }

    return {
      id,
      name,
      email,
    };
  },

  deleteUser: async ({ id }) => {
    const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [id]);

    return result.affectedRows
      ? {
          success: true,
          message: `Usuario ${id} eliminado`,
        }
      : {
          success: false,
          message: `No existe el usuario ${id}`,
        };
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
