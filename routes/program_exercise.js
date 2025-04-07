const express = require('express');
const pool = require('../db');  // Assure-toi que tu utilises la bonne connexion à la DB

const router = express.Router();


/**
 * @swagger
 * /api/program_exercises/{program_id}:
 *   get:
 *     summary: Récupérer les exercices d'un programme
 *     tags: [Program Exercises]
 *     parameters:
 *       - in: path
 *         name: program_id
 *         required: true
 *         description: ID du programme
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des exercices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   program_id:
 *                     type: string
 *                   exercise_id:
 *                     type: string
 *                   sets:
 *                     type: integer
 *                   reps:
 *                     type: integer
 *                   rest_time:
 *                     type: integer
 */
router.get('/:program_id', async (req, res) => {
  const { program_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM program_exercises WHERE program_id = $1`,
      [program_id]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des exercices", err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * @swagger
 * /program_exercises:
 *   post:
 *     summary: Créer un exercice dans un programme
 *     tags: [Program Exercises]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               program_id:
 *                 type: string
 *                 example: "uuid_program_id"
 *               exercise_id:
 *                 type: string
 *                 example: "uuid_exercise_id"
 *               sets:
 *                 type: integer
 *                 example: 3
 *               reps:
 *                 type: integer
 *                 example: 12
 *               rest_time:
 *                 type: integer
 *                 example: 60
 *     responses:
 *       201:
 *         description: Exercice ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 program_id:
 *                   type: string
 *                 exercise_id:
 *                   type: string
 *                 sets:
 *                   type: integer
 *                 reps:
 *                   type: integer
 *                 rest_time:
 *                   type: integer
 */
router.post('/', async (req, res) => {
    const { program_id, exercise_id, sets, reps, rest_time } = req.body;
  
    try {
      const result = await pool.query(
        `INSERT INTO program_exercises (program_id, exercise_id, sets, reps, rest_time) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [program_id, exercise_id, sets, reps, rest_time]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("Erreur lors de l'insertion dans program_exercises", err.message);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

/**
 * @swagger
 * /program_exercises/{id}:
 *   put:
 *     summary: Met à jour un exercice dans un programme
 *     tags: [Program Exercises]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'entrée à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sets:
 *                 type: integer
 *                 example: 4
 *               reps:
 *                 type: integer
 *                 example: 10
 *               rest_time:
 *                 type: integer
 *                 example: 90
 *     responses:
 *       200:
 *         description: Exercice mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Entrée non trouvée
 *       500:
 *         description: Erreur serveur
 */

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { sets, reps, rest_time } = req.body;
  
    try {
      const result = await pool.query(
        `UPDATE program_exercises SET sets = $1, reps = $2, rest_time = $3 WHERE id = $4 RETURNING *`,
        [sets, reps, rest_time, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Entrée non trouvée" });
      }
      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'exercice", err.message);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

/**
 * @swagger
 * /program_exercises/{id}:
 *   delete:
 *     summary: Supprime un exercice d'un programme
 *     tags: [Program Exercises]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'entrée à supprimer
 *     responses:
 *       204:
 *         description: Suppression réussie
 *       404:
 *         description: Entrée non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query(
        `DELETE FROM program_exercises WHERE id = $1 RETURNING *`,
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Entrée non trouvée" });
      }
      res.status(204).json();
    } catch (err) {
      console.error("Erreur lors de la suppression de l'exercice", err.message);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  module.exports = router;

  