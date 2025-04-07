const Usuario = require("../Classes/UserClass"); 
const connection = require("../config/db");
const crypto = require("crypto"); 

const hashPassword = (password) => {
    return crypto.createHash("sha256").update(Buffer.from(password, "utf8")).digest("hex").toUpperCase(); 
  
  };

const sql = require('mssql');
const Usuario = require('./Usuario');

async function createUsuario(usuario) {
    try {
        const pool = await sql.connect(config);
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

// Get Usuario by id
async function getUsuario(id) {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Usuarios WHERE idUsuario = @id');
        return result.recordset[0]; 
    } catch (error) {
        console.error('Error getting Usuario:', error);
    }
}

async function updateUsuario(id, usuario) {
    try {
        const pool = await sql.connect(config);
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

async function deleteUsuario(id) {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Usuarios WHERE idUsuario = @id');
        return result;
    } catch (error) {
        console.error('Error deleting Usuario:', error);
    }
}

module.exports = { createUsuario, getUsuario, updateUsuario, deleteUsuario };
