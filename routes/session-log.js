const express = require('express');
const router = express.Router();
const pool = require('../db');
const { v4: uuidv4 } = require('uuid');

/**
 * @swagger
 * tags:
 *   name: SessionLogs
 *   description: Suivi des séances effectuées
 */

/**
 * @swagger
 * /api/session-logs:
 *   post:
 *     summary: Enregistrer une séance complétée
 *     tags: [SessionLogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - session_id
 *             properties:
 *               user_id:
 *                 type: string
 *               session_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Log de séance enregistré
 *       500:
 *         description: Erreur serveur
 */
router.post('/session-logs', async (req, res) => {
  const { user_id, session_id } = req.body;

  try {
    await pool.query(
      `INSERT INTO session_logs (id, user_id, session_id)
       VALUES ($1, $2, $3)`,
      [uuidv4(), user_id, session_id]
    );

    res.status(201).json({ message: 'Séance enregistrée' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement de la séance' });
  }
});

/**
 * @swagger
 * /api/session-logs/{sessionId}/count:
 *   get:
 *     summary: Obtenir le nombre de fois qu'une séance a été faite
 *     tags: [SessionLogs]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la séance
 *     responses:
 *       200:
 *         description: Nombre de fois complété
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 session_id:
 *                   type: string
 *                 count:
 *                   type: integer
 *       500:
 *         description: Erreur serveur
 */
router.get('/session-logs/:sessionId/count', async (req, res) => {
  const { sessionId } = req.params;

  try {
    const result = await pool.query(
      `SELECT COUNT(*) FROM session_logs WHERE session_id = $1`,
      [sessionId]
    );

    res.status(200).json({
      session_id: sessionId,
      count: parseInt(result.rows[0].count, 10)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération du compteur' });
  }
});

module.exports = router;
