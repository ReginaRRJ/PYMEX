import { jest } from '@jest/globals';
import { verifyToken } from '../controllers/authMiddle.js';
import jwt from 'jsonwebtoken';

describe('verifyToken middleware', () => {
  const mockRequest = (token) => ({
    headers: {
      authorization: token ? `Bearer ${token}` : undefined
    }
  });

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const nextFunction = jest.fn();

  const SECRET_KEY = process.env.SECRET_KEY || 'secretPYME123';

  test('debe permitir el acceso con un token válido', () => {
    const token = jwt.sign({ id: 1, nombre: 'Test' }, SECRET_KEY);
    const req = mockRequest(token);
    const res = mockResponse();

    verifyToken(req, res, nextFunction);

    expect(req.user).toBeDefined();
    expect(req.user.id).toBe(1);
    expect(nextFunction).toHaveBeenCalled();
  });

  test('debe rechazar la solicitud sin token', () => {
    const req = mockRequest(null);
    const res = mockResponse();

    verifyToken(req, res, nextFunction);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token no proporcionado o malformado' });
  });

  test('debe rechazar la solicitud con token inválido', () => {
    const req = mockRequest('invalido.token.jwt');
    const res = mockResponse();

    verifyToken(req, res, nextFunction);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido o expirado' });
  });
});