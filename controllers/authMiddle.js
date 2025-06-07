// authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET || 'secretPYME123';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado o malformado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // opcional: guardar el payload para uso futuro
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};
