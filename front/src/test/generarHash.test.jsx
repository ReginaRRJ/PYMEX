// __tests__/utils/hash.test.js
import { TextEncoder } from 'util';

global.TextEncoder = TextEncoder;

// Si no la tienes exportada, copia la función directamente acá para probarla:
async function generarHash(contrasena) {
  const encoder = new TextEncoder();
  const data = encoder.encode(contrasena);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

describe('generarHash', () => {
  it('genera correctamente el hash SHA-256 para una contraseña', async () => {
    const input = '1234';
    const expectedHash = '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4';
    const hash = await generarHash(input);
    expect(hash).toBe(expectedHash);
  });
});
