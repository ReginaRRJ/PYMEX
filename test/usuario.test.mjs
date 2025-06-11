import { describe, test, expect } from '@jest/globals';
import Usuario from '../Classes/UserClass.js'; // Ajusta la ruta si está en otro directorio

describe('Clase Usuario', () => {
  test('Debe crear una instancia con las propiedades correctas', () => {
    const nombre = 'Juan';
    const apellido = 'Pérez';
    const rol = 'admin';
    const correo = 'juan@example.com';
    const contrasena = '123456';
    const hashContrasena = 'abc123hash';
    const idPyme = 42;

    const usuario = new Usuario(nombre, apellido, rol, correo, contrasena, hashContrasena, idPyme);

    expect(usuario.nombreUsuario).toBe(nombre);
    expect(usuario.apellidoUsuario).toBe(apellido);
    expect(usuario.rol).toBe(rol);
    expect(usuario.correo).toBe(correo);
    expect(usuario.contrasena).toBe(contrasena);
    expect(usuario.hashContrasena).toBe(hashContrasena);
    expect(usuario.idPyme).toBe(idPyme);
  });
});