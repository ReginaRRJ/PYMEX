// Import necessary modules using ES Modules syntax
import Usuario from "../Classes/UserClass.js"; 
import connection from "../config/db.js"; 
import crypto from "crypto"; 
import sql from 'mssql';

// Hashing the password using SHA256
const hashPassword = (password) => {
    return crypto.createHash("sha256").update(Buffer.from(password, "utf8")).digest("hex").toUpperCase(); 
};

// Function to create a new Usuario
async function createUsuario(usuario) {
    try {
        const pool = await sql.connect(connection);
        const result = await pool.request()
            .input('nombreUsuario', sql.NVarChar, usuario.nombreUsuario)
            .input('apellidoUsuario', sql.NVarChar, usuario.apellidoUsuario)
            .input('rol', sql.NVarChar, usuario.rol)
            .input('correo', sql.NVarChar, usuario.correo)
            .input('contrasena', sql.NVarChar, usuario.contrasena)
            .input('hashContrasena', sql.NVarChar, usuario.hashContrasena)
            .input('idPyme', sql.Int, usuario.idPyme)
            .query('INSERT INTO Usuarios (nombreUsuario, apellidoUsuario, rol, correo, contrasena, hashContrasena, idPyme) VALUES (@nombreUsuario, @apellidoUsuario, @rol, @correo, @contrasena, @hashContrasena, @idPyme)');
        return result;
    } catch (error) {
        console.error('Error creating Usuario:', error);
    }
}

// Function to get Usuario by id
async function getUsuario(id) {
    try {
        const pool = await sql.connect(connection);
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Usuarios WHERE idUsuario = @id');
        return result.recordset[0]; 
    } catch (error) {
        console.error('Error getting Usuario:', error);
    }
}

// Function to update Usuario by id
async function updateUsuario(id, usuario) {
    try {
        const pool = await sql.connect(connection);
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('nombreUsuario', sql.NVarChar, usuario.nombreUsuario)
            .input('apellidoUsuario', sql.NVarChar, usuario.apellidoUsuario)
            .input('rol', sql.NVarChar, usuario.rol)
            .input('correo', sql.NVarChar, usuario.correo)
            .input('contrasena', sql.NVarChar, usuario.contrasena)
            .input('hashContrasena', sql.NVarChar, usuario.hashContrasena)
            .input('idPyme', sql.Int, usuario.idPyme)
            .query('UPDATE Usuarios SET nombreUsuario = @nombreUsuario, apellidoUsuario = @apellidoUsuario, rol = @rol, correo = @correo, contrasena = @contrasena, hashContrasena = @hashContrasena, idPyme = @idPyme WHERE idUsuario = @id');
        return result;
    } catch (error) {
        console.error('Error updating Usuario:', error);
    }
}

// Function to delete Usuario by id
async function deleteUsuario(id) {
    try {
        const pool = await sql.connect(connection);
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Usuarios WHERE idUsuario = @id');
        return result;
    } catch (error) {
        console.error('Error deleting Usuario:', error);
    }
}

// Export the functions using ES Module export
export { createUsuario, getUsuario, updateUsuario, deleteUsuario, hashPassword };
/*import Usuario from "../Classes/UserClass.js";  // Make sure to import the Usuario class

async function getUsuario(id) {
    try {
        const pool = await sql.connect(connection);
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Usuarios WHERE idUsuario = @id');
        
        // If a user is found, create an instance of the Usuario class
        if (result.recordset.length > 0) {
            const userData = result.recordset[0];
            // Create a new instance of the Usuario class with the user data
            const user = new Usuario(
                userData.nombreUsuario,
                userData.apellidoUsuario,
                userData.rol,
                userData.correo,
                userData.contrasena,
                userData.hashContrasena,
                userData.idPyme
            );
            return user;  // Return the instance of Usuario
        } else {
            return null;  // Return null if no user is found
        }
    } catch (error) {
        console.error('Error getting Usuario:', error);
    }
}
*/ 