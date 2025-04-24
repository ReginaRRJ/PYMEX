// Importing necessary modules using ES Module syntax
import connection from "../config/db.js"; // Make sure to add .js extension to local imports
import bcrypt from "bcryptjs";

// Controller to get all users
export const getUsers = async (req, res) => {
  try {
    const query = `SELECT * FROM Usuario`;
    connection.exec(query, [], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(result);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to create a new user
export const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO Usuario (nombreUsuario, correo, contrasena) VALUES (?, ?, ?)`;
    connection.exec(query, [username, email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: "Usuario creado exitosamente" });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to update a user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;

    // Check if there is something to update
    if (!username && !email && !password) {
      return res.status(400).json({ message: "Nada que actualizar" });
    }

    let updates = [];
    let values = [];

    if (username) {
      updates.push("nombreUsuario = ?");
      values.push(username);
    }
    if (email) {
      updates.push("correo = ?");
      values.push(email);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push("contrasena = ?");
      values.push(hashedPassword);
    }

    values.push(id);

    const query = `UPDATE USERS SET ${updates.join(", ")} WHERE ID = ?`;

    connection.exec(query, values, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!result || result.affectedRows === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json({ message: "Usuario actualizado exitosamente" });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to delete a user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `DELETE FROM USERS WHERE ID = ?`;

    connection.prepare(query, (err, statement) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      statement.exec([id], (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // In SAP HANA, `result` is an array, and we need to check if something was deleted.
        if (!result || result.length === 0) {
          return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({ message: "Usuario eliminado exitosamente" });
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
