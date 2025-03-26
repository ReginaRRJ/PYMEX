const express = require("express");
const router = express.Router();
const { login } = require("../controllers/loginController");

/**
 * @swagger
 * tags:
 *   - name: login
 *     description: Operaciones relacionadas con los usuarios
 */
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Autenticación de usuario
 *     description: Permite iniciar sesión y obtener un token JWT.
 *     operationId: loginUser
 *     tags: [login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "a01174992@tec.mx"
 *               password:
 *                 type: string
 *                 example: "caro1234"
 *     responses:
 *       200:
 *         description: Login exitoso, retorna un token JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Credenciales incorrectas.
 *       500:
 *         description: Error en el servidor.
 */

router.post("/", login);

module.exports = router;