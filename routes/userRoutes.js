// userRoutes.js
import express from "express"; // Import express using ESM syntax
import { getUsers, createUser, updateUser, deleteUser } from "../controllers/userController.js"; // Use named imports for controller functions

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: users
 *     description: Operaciones relacionadas con los usuarios
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     description: Obtiene todos los usuarios
 *     operationId: getUser
 *     tags: [users]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *       500:
 *         description: Internal Server Error
 */

// Obtener todos los usuarios
router.get("/", getUsers);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crea un nuevo usuario
 *     description: Crea un nuevo usuario
 *     operationId: createUser
 *     tags: [users]
 *     requestBody:
 *       description: Añadir un nuevo usuario
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: CarolinaResendz
 *               email:
 *                 type: string
 *                 example: a01174992@tec.mx
 *               password:
 *                 type: string
 *                 example: Carolina1234
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      message: 
 *                          type: string
 *                          example: Usuario creado exitosamente
 *       500M:
 *        description: Missing input
 *        content:
 *         application/json:
 *              schema:
 *                 type: object
 *                 properties:
 *                      email:
 *                          type: string
 *                          example: a01174992@tec.mx
 *                      password:
 *                          type: string
 *                          example: Carolina1234
*       500C:
*        description: Correo ya registrado
*        content:
*         application/json:
*              schema:
*                 type: object
*                 properties:
*                      username:
 *                          type: string
 *                          example: CarolinaResendz
 *                      email:
 *                          type: string
 *                          example: a01174992@tec.mx
 *                      password:
 *                          type: string
 *                          example: Carolina1234
 */
// Crear un usuario
router.post("/", createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Actualiza un usuario existente
 *     description: Permite actualizar los datos de un usuario registrado en el sistema.
 *     operationId: updateUser  # Identificador único para la operación
 *     tags: [users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del usuario que se desea actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Datos actualizados del usuario
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "nuevo_nombre"
 *               email:
 *                 type: string
 *                 example: "nuevo_correo@example.com"
 *               password:
 *                 type: string
 *                 example: "nueva_contraseña"
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      username:
 *                          type: string
 *                          example: CarolinaResendz
 *                      email:
 *                          type: string
 *                          example: a01174992@tec.mx
 *                      password:
 *                          type: string
 *                          example: Carolina12345           
 *       400:
 *         description: Error en los datos enviados
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */

// Actualizar usuario
router.put("/:id", updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Elimina un usuario
 *     description: Permite eliminar un usuario registrado en el sistema mediante su ID.
 *     operationId: deleteUser  # Identificador único para esta operación en Swagger
 *     tags: [users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del usuario que se desea eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */

// Eliminar usuario
router.delete("/:id", deleteUser);

export default router; // Use export default for the router
