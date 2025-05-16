const express = require('express');
const router = express.Router();
const pool = require('../db');
const { v4: uuidv4 } = require('uuid');

/// 📌 Séances d’un programme

// Toutes les séances pour un programme
/**
 * @swagger
 * /api/sessions/program/{programId}:
 *   get:
 *     summary: Récupérer les séances d'un programme
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: programId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du programme
 *     responses:
 *       200:
 *         description: Liste des séances du programme
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */

router.get('/program/:programId', async (req, res) => {
  try {
    const { programId } = req.params;
    const result = await pool.query(
      'SELECT * FROM program_sessions WHERE program_id = $1',
      [programId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des séances' });
  }
});

// Une séance par ID
/**
 * @swagger
 * /api/sessions/{id}:
 *   get:
 *     summary: Récupérer une séance par ID
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la séance
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Séance trouvée
 *       404:
 *         description: Séance non trouvée
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM program_sessions WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Séance non trouvée' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération de la séance' });
  }
});

// Créer une séance
/**
 * @swagger
 * /api/sessions:
 *   post:
 *     summary: Créer une nouvelle séance
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - program_id
 *               - name
 *             properties:
 *               program_id:
 *                 type: string
 *               name:
 *                 type: string
 *               day_number:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 7
 *     responses:
 *       201:
 *         description: Séance créée avec succès
 */
router.post('/', async (req, res) => {
  const { program_id, name, day_number } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO program_sessions (id, program_id, name, day_number)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [uuidv4(), program_id, name, day_number]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la création de la séance' });
  }
});


// Modifier une séance
/**
 * @swagger
 * /api/sessions/{id}:
 *   put:
 *     summary: Mettre à jour une séance
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la séance
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - program_id
 *               - name
 *               - day_number
 *             properties:
 *               program_id:
 *                 type: string
 *               name:
 *                 type: string
 *               day_number:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 7
 *
 *     responses:
 *       200:
 *         description: Séance mise à jour
 *       404:
 *         description: Séance non trouvée
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, day_number } = req.body;

  try {
    const result = await pool.query(
      `UPDATE program_sessions
       SET name = $1, day_number = $2
       WHERE id = $3 RETURNING *`,
      [name, day_number, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Séance non trouvée' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la séance' });
  }
});


// Supprimer une séance
/**
 * @swagger
 * /api/sessions/{id}:
 *   delete:
 *     summary: Supprimer une séance
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la séance
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Séance supprimée
 *       404:
 *         description: Séance non trouvée
 */

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM program_sessions WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Séance non trouvée' });
    res.json({ message: 'Séance supprimée avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la suppression de la séance' });
  }
});

/// 🏋️ Exercices dans une séance

// Tous les exercices d’une séance
/**
 * @swagger
 * /api/sessions/{sessionId}/exercises:
 *   get:
 *     summary: Récupérer les exercices d'une séance
 *     tags: [Session Exercises]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la séance
 *     responses:
 *       200:
 *         description: Liste des exercices de la séance
 */
router.get('/:sessionId/exercises', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const result = await pool.query(
      `SELECT se.*, e.name, e.muscle_group, e.difficulty
       FROM session_exercises se
       JOIN exercises e ON se.exercise_id = e.id
       WHERE se.session_id = $1`,
      [sessionId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des exercices' });
  }
});

// Ajouter un exercice à une séance
/**
 * @swagger
 * /api/sessions/{sessionId}/exercises:
 *   post:
 *     summary: Ajouter un exercice à une séance
 *     tags: [Session Exercises]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la séance
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - exercise_id
 *               - sets
 *               - reps
 *               - rest_time
 *             properties:
 *               exercise_id:
 *                 type: string
 *               sets:
 *                 type: integer
 *               reps:
 *                 type: integer
 *               rest_time:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Exercice ajouté à la séance
 */
router.post('/:sessionId/exercises', async (req, res) => {
  const { sessionId } = req.params;
  const { exercise_id, sets, reps, rest_time } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO session_exercises (id, session_id, exercise_id, sets, reps, rest_time)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [uuidv4(), sessionId, exercise_id, sets, reps, rest_time]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l'ajout de l'exercice à la séance" });
  }
});

// Modifier un exercice dans une séance
/**
 * @swagger
 * /api/sessions/exercises/{exerciseInstanceId}:
 *   put:
 *     summary: Modifier un exercice dans une séance
 *     tags: [Session Exercises]
 *     parameters:
 *       - in: path
 *         name: exerciseInstanceId
 *         required: true
 *         description: ID de l'instance de l'exercice
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sets:
 *                 type: integer
 *               reps:
 *                 type: integer
 *               rest_time:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Exercice mis à jour
 *       404:
 *         description: Instance non trouvée
 */
router.put('/exercises/:exerciseInstanceId', async (req, res) => {
  const { exerciseInstanceId } = req.params;
  const { sets, reps, rest_time } = req.body;
  try {
    const result = await pool.query(
      `UPDATE session_exercises SET sets = $1, reps = $2, rest_time = $3
       WHERE id = $4 RETURNING *`,
      [sets, reps, rest_time, exerciseInstanceId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Instance d'exercice non trouvée" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la mise à jour de l'exercice" });
  }
});

// Supprimer un exercice d’une séance
/**
 * @swagger
 * /api/sessions/exercises/{exerciseInstanceId}:
 *   delete:
 *     summary: Supprimer un exercice d'une séance
 *     tags: [Session Exercises]
 *     parameters:
 *       - in: path
 *         name: exerciseInstanceId
 *         required: true
 *         description: ID de l'instance de l'exercice
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exercice supprimé
 *       404:
 *         description: Instance non trouvée
 */
router.delete('/exercises/:exerciseInstanceId', async (req, res) => {
  const { exerciseInstanceId } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM session_exercises WHERE id = $1 RETURNING *`,
      [exerciseInstanceId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Instance d'exercice non trouvée" });
    res.json({ message: 'Exercice supprimé de la séance' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la suppression de l'exercice" });
  }
});

module.exports = router;
